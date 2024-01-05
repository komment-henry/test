/* eslint-disable prettier/prettier */

import LogisticService from '../services/logistic.service'
import { Op } from 'sequelize'
import UserHelper from './user.helper'
import FileHelper from "./fileUpload.helper"
import moment from 'moment-timezone'
import * as DbModel from '../models/index'
import * as NftHelper from "./nft.helper";
import physicalIdHelper from "./physicalId.helper";
import PdfHelper from "./pdf.helper";
import * as csv from '@fast-csv/format'
import Holidays from 'date-holidays'
import xlsxHelper from '../../api/helpers/xslx.helper'
import MailHelper from './mail.helper'
import { TypeShippingOrderDetails } from '../types/ShippingOrderDetails';
import SendPulseHelper from './sendpulse.helper'


class LogisticHelper {
 private PAYMENT_STATUSES = {
   NotPaid: 'not paid',
   Paid: 'paid',
   Cancelled: 'cancelled',
   Error: 'error'
 }
 public async getDeliveryOptions(data: any, ignoreRestrictions = false) {
   console.log('getDeliveryOptions')
   const result: any = {}


   let nbBottles = 0
   let bottleVolume = 0
   let NftDetails: any = {}
   let bottlesLimit = 0
   let shippingCountryTax = 0
   let shippingCountryCode = ''
   let isShippingCountryEU = false
   let nftIds: any = []


   if (!data.nfts) {
     return {
       error: true,
       message: 'no nfts',
     }
   }
   if (!data.shippingSettings) {
     return {
       error: true,
       message: 'no address',
     }
   }


   const destAddress: any = {
     country: data.shippingSettings.country,
     city: data.shippingSettings.city,
     zipCode: data.shippingSettings.zip,
     addressType: 'individual',
   }


   if (!ignoreRestrictions) {
     console.log('getShippingCountry')
     const ShippingCountry: any = await UserHelper.getShippingCountry(data.shippingSettings.country, data.shippingSettings.state)
     if (ShippingCountry.shipping == 'Not Shipping') {
       return {
         error: true,
         type: 'winechain restriction',
         message: 'Unfortunately at the moment we cannot ship to your country. Please select another country',
       }
     }
     if (ShippingCountry.shipping == 'Coming Soon') {
       bottlesLimit = ShippingCountry.bottles_limit
     }


     if (data.shippingSettings.state) {
       destAddress.state = ShippingCountry.state_code
     }
     shippingCountryTax = ShippingCountry.tax
     shippingCountryCode = ShippingCountry.code
     isShippingCountryEU = Boolean(ShippingCountry.continent === 'EU')
   }


   const destinationCountry: any = await DbModel.CountriesModel.findOne({
     where: { code: data.shippingSettings.country },
     attributes: ['continent', 'countrycode'],
     nest: true,
     raw: true,
   })
   nftIds = data.nfts.map((item: any) => {
     return item.id
   }),


     await NftHelper.checkAndUpdatePriceEur(nftIds)


   let nftRestrictions: any = [];
   NftDetails = await DbModel.NftDetailModel.findAll({
     where: {
       nft_token_id: {
         [Op.in]: nftIds
       },
       user_id: data.userId
     },
     include: [
       {
         model: DbModel.Drops,
         as: 'nft_details',
         required: false,
         include: [
           {
             model: DbModel.BottlesModel,
             as: 'bottle_data',
             required: false,
             include: [
               {
                 model: DbModel.BottleSize,
                 as: 'wine_size',
                 attributes: ['volume'],
                 required: false,
               }
             ],
           },
           {
             model: DbModel.Pallets,
             as: 'pallete',
             required: false,
             include: [
               {
                 model: DbModel.PackagingTypeModel,
                 as: 'packaging_type',
                 required: false,
               }
             ]
           }
         ],
       },
     ],
     nest: true,
     raw: true,
   })


   if (!NftDetails) {
     return {
       error: true,
       message: 'You dont have this nft in your wallet',
     }
   }


   let packageOptionsRaw: any = await DbModel.PackageOptionModel.findAll({
     //https://zira.zstream.io/app/tasks/task/WNC-1394
     where: { per_case: { [Op.ne]: '1' } },
     nest: true,
   })
   const defaultPackageOption = 1 //1 cardboard//3 cardboard + case
   let nftPackageOptions: any = []
   let packageOptions = packageOptionsRaw.map((option: any) => {
     return {
       id: option.option_id,
       name: option.name,
       description: option.description,
       images: [option.image],
       price: option.price_eur,
       perCase: option.per_case
     }
   })
   let packages: any = []
   let totalNbBottles = 0
   let totalPackagingPrice = 0
   let totalNftPrice = 0
   let palletized = 0
   for (const nftDetail of NftDetails) {
     if (ignoreRestrictions) {
       const dropAllowedCountries: any = await DbModel.NftModel.findOne({
         where: { id: 1 },
         attributes: ['shipping_location'],
       })
     }
     let availableOptions: any = []


     if (nftDetail?.nft_details?.pallete?.packaging_type?.id) {
       const { cardboard, styrofoam, crd_wood, sty_wood, vin_liner } = nftDetail.nft_details.pallete.packaging_type;


       if (cardboard) {
         availableOptions.push(1);
       }
       if (styrofoam) {
         availableOptions.push(2);
       }
       if (crd_wood) {
         availableOptions.push(3);
       }
       if (sty_wood) {
         availableOptions.push(4);
       }
       if (vin_liner) {
         availableOptions.push(5);
       }
     } else {
       availableOptions = [1, 2, 3, 4, 5]
     }
     if (nftDetail.price_at_drop > 5000) {
       availableOptions = availableOptions.filter((item: any) => item !== 1)
     }
     if (nftDetail.nft_details.no_of_bottles) {
       nbBottles = nftDetail.nft_details.no_of_bottles
       totalNbBottles += nbBottles
       bottleVolume = nftDetail.nft_details.bottle_data.wine_size.volume
     } else {
       return {
         error: true,
         message: 'unknown nft type',
       }
     }


     const nftPackageOption = data.nfts.find((elem: any) => +elem.id === +nftDetail.nft_token_id)
     let nftPackageOptionId = nftPackageOption?.packageOptionId
       ? nftPackageOption.packageOptionId
       : defaultPackageOption
     nftPackageOptions.push({
       nft_id: nftDetail.nft_token_id,
       availableOptions,
       currentOption: nftPackageOptionId,
     })
     totalNftPrice += +nftDetail.nft_details.price
     let packagesSizes: any = {};
     const packageOption: any = await DbModel.PackageOptionModel.findOne({
       //where: {option_id: nftPackageOption?nftPackageOption.packageOptionId:defaultPackageOption},
       where: { option_id: nftPackageOptionId },
       nest: true,
     })


     if (packageOption.weight) {
       packagesSizes = {
         fromApi: false,
         nb: 1,
         weight: packageOption.weight,
         width: packageOption.width,
         height: packageOption.height,
         length: packageOption.length,
         nbBottles: 0,
       }


       packages.push(packagesSizes)
     }


     let packageSizeParams: any = {}
     if (bottleVolume < 1500) {
       packageSizeParams = { nbBottles }
     } else if (bottleVolume >= 1500) {
       packageSizeParams = { nbMagnums: nbBottles }
     }


     console.log('getPackageSizes')
     packagesSizes = await LogisticService.getPackageSizes(packageSizeParams)
     packagesSizes.fromApi = true
     packagesSizes.nb = packagesSizes.data.packages[0].choice1[0].nbPackages //TODO check for optimal choice
     packagesSizes.weight = packagesSizes.data.packages[0].choice1[0].sizes.weightStill
     packagesSizes.width = packagesSizes.data.packages[0].choice1[0].sizes.width
     packagesSizes.height = packagesSizes.data.packages[0].choice1[0].sizes.height
     packagesSizes.length = packagesSizes.data.packages[0].choice1[0].sizes.length


     packagesSizes.nbBottles = nbBottles


     packagesSizes.bottleVolume = bottleVolume
     packagesSizes.price = nftDetail.nft_details.price
     if (packageOption.per_case) {
       packagesSizes.packagingPrice = packageOption.price_eur
     } else {
       packagesSizes.packagingPrice = packageOption.price_eur * nbBottles
     }
     packages.push(packagesSizes)
   }
   if (nftRestrictions.length > 0) {
     return {
       error: true,
       type: 'winery restriction',
       message: 'Unfortunately winery does not allow shipping to your destination country.',
       nft_ids: nftRestrictions,
     }
   }
   packages = packages.map((item: any) => {
     let packag: any = {
       nb: 1,
       weight: item.weight,
       width: item.width,
       height: item.height,
       length: item.length,
     }
     packag.nbBottles = item.nbBottles
     packag.bottleVolume = item.bottleVolume
     packag.price = item.price
     packag.fromApi = item.fromApi
     packag.packagingPrice = item.packagingPrice || 0
     totalPackagingPrice += item.packagingPrice || 0
     return packag
   })
   const expHour: any = moment(new Date()).tz('Europe/Paris').format('HH')
   const expDate: any = moment(new Date())


   const isBefore12pm = expHour < 12;
   let deliveryDaysToAdd = isBefore12pm ? 2 : 3;


   // Check if the order is placed on a weekend (Saturday or Sunday)
   if (expDate.isoWeekday() === 6) { // Saturday
     deliveryDaysToAdd = isBefore12pm ? 3 : 4;
   } else if (expDate.isoWeekday() === 7) { // Sunday
     deliveryDaysToAdd = isBefore12pm ? 2 : 3;
   }


   // Check if the calculated delivery date falls on a holiday for the specified country
   expDate.add(deliveryDaysToAdd, 'd')
     .tz('Europe/Paris')
     .format('YYYY-MM-DD');


   // Create a new Holidays instance for the specified country
   const hd = new Holidays('FR');


   while (hd.isHoliday(expDate)) {
     // If the calculated delivery date is a holiday, add additional days until it's not a holiday
     deliveryDaysToAdd++;
     expDate.add(1, 'd');
   }
   console.log(expDate.format('YYYY-MM-DD'))


   let shippings: any = []
   let shippingCacheData: any = [];
   if (bottlesLimit == 0) {
     let shippingObject = {
       packages: packages,
       nbBottles: totalNbBottles,
       econom: {},
       express: {},
       palletized
     }
     console.log('getShipping')
     let shipping = await getShipping(packages, totalNbBottles, totalPackagingPrice, shippingObject)
     shippings.push(shipping);
     shippingCacheData.push(shippingObject)
   } else {
     let packagesParts: any = []
     let bottleCounter = 0
     let shippingNumber = 0
     let packagingPrice = 0
     for (let i = 0; i < packages.length; i++) {
       bottleCounter += packages[i].nbBottles
       packagingPrice += packages[i].packagingPrice
       if (bottleCounter > bottlesLimit) {
         shippingNumber += 1
         bottleCounter = packages[i].nbBottles
         packagingPrice = packages[i].packagingPrice
       }
       if (!packagesParts[shippingNumber].packages) {
         packagesParts[shippingNumber].packages = []
         packagesParts[shippingNumber].nbBottles = 0
         packagesParts[shippingNumber].packagingPrice = 0
       }
       packagesParts[shippingNumber].packages.push(packages[i])
       packagesParts[shippingNumber].nbBottles = bottleCounter
       packagesParts[shippingNumber].packagingPrice = packagingPrice
     }
     for (let j = 0; j < packagesParts.length; j++) {
       let shippingObject = {
         packages: packagesParts[j].packages,
         nbBottles: packagesParts[j].nbBottles,
         econom: {},
         express: {},
         palletized
       }


       console.log('getShipping')
       let shipping = await getShipping(packagesParts[j].packages, packagesParts[j].nbBottles, packagesParts[j].packagingPrice, shippingObject)
       shippings.push(shipping)
       shippingCacheData.push(shippingObject)
     }
   }


   async function getShipping(packages: any, nbBottles: any, packagingPrice: any, shippingObject: any) {
     const shippingOptions: any = {}


     console.log('getRates')
     let pickupDate = await xlsxHelper.pickupDateCalculation()
     let shippingRates = await LogisticService.getRates({
       destAddress,
       packages,
       nbBottles: nbBottles,
       pickupDate: moment(pickupDate).format('yyyy-MM-DD'),
       pallets: palletized,
     })
     const econom = []
     const express = []


     if (shippingRates !== null && Array.isArray(shippingRates.data)) {
       for (const item of shippingRates.data) {
         const shippingDuration =
           (new Date(item.deliveryDate).getTime() - new Date(item.pickupDate).getTime()) / (1000 * 3600 * 24)


         if (shippingDuration < 10 && shippingDuration >= 0) {
           express.push(item)
         } else {
           econom.push(item)
         }
       }


       console.log('prepareResult')
       shippingOptions.econom = await prepareResult(econom, packagingPrice)
       shippingOptions.express = await prepareResult(express, packagingPrice)
       shippingObject.econom = shippingOptions.econom?.fullShipping
       shippingObject.express = shippingOptions.express?.fullShipping
       if (
         shippingOptions.econom &&
         shippingOptions.express &&
         shippingOptions.econom.shippingPrice > shippingOptions.express.shippingPrice
       ) {
         delete shippingOptions.econom
       }
     }
     return shippingOptions
   }


   async function prepareResult(resultArray: any, packagingPrice: any) {
     let result: any = null
     if (resultArray.length > 0) {
       console.log('compareByPrice')
       resultArray.sort(compareByPrice)
       result = {
         name: resultArray[0].name,
         service: resultArray[0].service,
         shippingPrice: resultArray[0].price,
         pickupDate: resultArray[0].pickupDate,
         fullShipping: resultArray[0]
       }


       let shippingCost = await calculationShippingCost(resultArray[0].price, packagingPrice)
       console.log('shippingCost:', shippingCost)
       return { ...result, ...shippingCost }


       let totalEurPrice = 0;
       let totalEurPriceExVat = 0;
       for (const nft of NftDetails) {
         totalEurPrice += Number(nft.nft_details.price_eur)
         totalEurPriceExVat += Number(nft.nft_details.price_ex_vat_eur)
       }


       result.insurance = Number(((resultArray[0].price + totalEurPrice) * 1.1) * 0.01).toFixed(2)
       result.totalPackagingPrice = packagingPrice
       result.shippingPackaging = Number(Number(result.shippingPrice) + Number(result.totalPackagingPrice) + Number(result.insurance)).toFixed(2)


       switch (destinationCountry.countrycode) {
         case 'USA':
           result.vat = Number((totalEurPriceExVat * 0.07).toFixed(2)) + Number((result.shippingPackaging * 0.2).toFixed(2));
           result.dutiesTaxes = 0;
           break;
         case 'GBR':
           result.vat = Number((totalEurPriceExVat * 0.2).toFixed(2)) + Number((result.shippingPackaging * 0.2).toFixed(2));
           result.dutiesTaxes = 0;
           break;
         default:
           if (destinationCountry.continent === 'EU') {
             result.vat = 0;
             result.dutiesTaxes = 0;
           } else {
             result.vat = 0;


             let taxes = 0
             for (const pack of packages) {
               if (pack.fromApi) {
                 console.log('getDutyTax')
                 const tax = await LogisticService.getDutyTax({
                   country: String(data.shippingSettings.country),
                   carrier: String(resultArray[0].name),
                   weight: pack.weight,
                   shippingPrice: Number(resultArray[0].price),
                   wineType: 'wine', //TODO add wine type
                   quantity: Number(pack.nbBottles),
                   capacity: Number(pack.bottleVolume),
                   alcoholDegree: Number(12), //TODO add alcohol from db
                   unitPrice: Number(pack.price / pack.nbBottles),
                 })
                 taxes += tax.data.price
               }
             }
             result.dutiesTaxes = Number(taxes).toFixed(2)
           }
       }


     }
     return result
   }


   async function calculationShippingCost(shippingPrice: any, packagingPrice: any) {
     let insurance = 0
     let vat = 0
     let dutiesTaxes = 0
     let vatOnCostWine = 0
     let totalShippingCost = 0
     let valueNFTexVAT = 0
     const FranceVATRate = 20 //20% French VAT since the warehouse is in France


     // Test for US
     // shippingCountryCode = 'US'
     // shippingCountryTax = 7
     // TEST for CH
     // shippingCountryCode = 'CH'
     // shippingCountryTax = 7


     for (const nft of NftDetails) {
       valueNFTexVAT = Number(nft.nft_details.price_eur)
       let valueNFTinclVAT = valueNFTexVAT * 1.2
       let vatOnShipping = (shippingPrice + packagingPrice) * (FranceVATRate / 100)
       if (shippingCountryCode === 'CH' || shippingCountryCode === 'GB' || shippingCountryCode === 'UK') {
         vatOnCostWine += (valueNFTexVAT * (shippingCountryTax / 100))
       }
       //Tax for Singapore - $8.5 per 750ml bottle + 13% * (NFT value + $8.5 per 750ml bottle)
       if (shippingCountryCode === 'SG') {
         const wineSize = nft.nft_details.bottle_data.wine_size.volume
         let tax = totalNbBottles * (8.5 * (wineSize / 750))
         dutiesTaxes = tax + (tax + valueNFTexVAT) * 0.13
       }
       if (shippingCountryCode === 'US') {
         dutiesTaxes += valueNFTexVAT * (shippingCountryTax / 100)
       }
       if (nft.nft_details.drop_mode === 'VAT incl') {


       } else if (nft.nft_details.drop_mode === 'VAT ex' && isShippingCountryEU) {
         vatOnCostWine += (valueNFTexVAT * (shippingCountryTax / 100))
       }
       insurance += ((shippingPrice + valueNFTexVAT) * 1.1 * 0.01)
       vat += (vatOnShipping + vatOnCostWine)
     }
     totalShippingCost = (shippingPrice + vatOnCostWine + dutiesTaxes)
     return {
       valueNFTexVAT: valueNFTexVAT.toFixed(2),
       insurance: insurance.toFixed(2),
       totalPackagingPrice: packagingPrice.toFixed(2),
       vat: vat.toFixed(2),
       dutiesTaxes: dutiesTaxes.toFixed(2),
       totalShippingCost: totalShippingCost.toFixed(2),
       dutiesAndFees: (vatOnCostWine + dutiesTaxes).toFixed(2)
     }
   }


   function compareByPrice(a: any, b: any) {
     if (a.price < b.price) {
       return -1
     }
     if (a.price > b.price) {
       return 1
     }
     return 0
   }
   result.packageOptions = packageOptions
   result.nftPackageOptions = nftPackageOptions
   result.NftDetails = NftDetails
   result.deliveryDetails = {
     nbBottles,
     packages,
     palletized
   }
   result.shippingOptions = {
     econom: {
       name: '',
       service: '',
       shippingPrice: 0,
       pickupDate: '',
       totalPackagingPrice: 0,
       totalPackagingPriceCurent: 0,
       valueNFTexVAT: 0,
       insurance: 0,
       shippingPackaging: 0,
       vat: 0,
       dutiesTaxesCurent: 0,
       dutiesAndFees: 0,
       totalShippingCost: 0,
     },
     express: {
       name: '',
       service: '',
       shippingPrice: 0,
       pickupDate: '',
       totalPackagingPrice: 0,
       totalPackagingPriceCurent: 0,
       valueNFTexVAT: 0,
       insurance: 0,
       shippingPackaging: 0,
       vat: 0,
       dutiesTaxesCurent: 0,
       dutiesAndFees: 0,
       totalShippingCost: 0,
     },
   }
   for (let shipping of shippings) {
     if (shipping.econom) {
       result.shippingOptions.econom.carrier = shipping?.econom?.fullShipping
       result.shippingOptions.econom.name = shipping.econom.name
       result.shippingOptions.econom.service = shipping.econom.service
       result.shippingOptions.econom.shippingPrice += +shipping.econom.shippingPrice
       result.shippingOptions.econom.pickupDate = +shipping.econom.pickupDate
       result.shippingOptions.econom.valueNFTexVAT = +shipping.econom.valueNFTexVAT
       result.shippingOptions.econom.totalPackagingPrice = 0
       result.shippingOptions.econom.totalPackagingPriceCurent += +shipping.econom.totalPackagingPrice
       result.shippingOptions.econom.insurance += +shipping.econom.insurance
       result.shippingOptions.econom.vat += +shipping.econom.vat
       result.shippingOptions.econom.dutiesTaxes = 0
       result.shippingOptions.econom.dutiesTaxesCurent += +shipping.econom.dutiesTaxes
       result.shippingOptions.econom.dutiesAndFees += +shipping.econom.dutiesAndFees
       result.shippingOptions.econom.totalShippingCost += +shipping.econom.totalShippingCost
     } else {
       delete result.shippingOptions.econom
     }
     if (shipping.express) {
       result.shippingOptions.express.carrier = shipping?.express?.fullShipping
       result.shippingOptions.express.name = shipping.express.name
       result.shippingOptions.express.service = shipping.express.service
       result.shippingOptions.express.shippingPrice += +shipping.express.shippingPrice
       result.shippingOptions.express.pickupDate = shipping.express.pickupDate
       result.shippingOptions.express.valueNFTexVAT = +shipping.express.valueNFTexVAT
       result.shippingOptions.express.totalPackagingPrice = 0
       result.shippingOptions.express.totalPackagingPriceCurent += +shipping.express.totalPackagingPrice
       result.shippingOptions.express.insurance += +shipping.express.insurance
       result.shippingOptions.express.vat += +shipping.express.vat
       result.shippingOptions.express.dutiesTaxes = 0
       result.shippingOptions.express.dutiesTaxesCurent += +shipping.express.dutiesTaxes
       result.shippingOptions.express.dutiesAndFees += +shipping.express.dutiesAndFees
       result.shippingOptions.express.totalShippingCost += +shipping.express.totalShippingCost
     } else {
       delete result.shippingOptions.express
     }
   }


   return result
 }


 public async getPackagingOptions(nfts: any[] = [], user_id: string) {
   const nftDetails = await DbModel.NftDetailModel.findAll({
     where: {
       nft_token_id: {
         [Op.in]: nfts.map((item: any) => {
           return item.id
         }),
       }
     },
     include: [
       {
         model: DbModel.Drops,
         as: 'nft_details',
         required: false,
         include: [
           {
             model: DbModel.BottlesModel,
             as: 'bottle_data',
             required: false,
             include: [
               {
                 model: DbModel.BottleSize,
                 as: 'wine_size',
                 attributes: ['volume'],
                 required: false,
               }
             ],
           },
           {
             model: DbModel.Pallets,
             as: 'pallete',
             required: false,
             include: [
               {
                 model: DbModel.PackagingTypeModel,
                 as: 'packaging_type',
                 required: false,
               }
             ]
           }
         ],
       },
     ],
     nest: true,
     raw: true,
   })


   if (!nftDetails) {
     return {
       error: true,
       message: 'You dont have this nft in your wallet',
     }
   }


   let packageOptionsRaw: any = await DbModel.PackageOptionModel.findAll({
     //https://zira.zstream.io/app/tasks/task/WNC-1394
     where: { per_case: { [Op.ne]: '1' } },
     nest: true,
   })


   let packageOptions = packageOptionsRaw.map((option: any) => {
     return {
       id: option.option_id,
       name: option.name,
       description: option.description,
       images: [option.image],
       price: option.price_eur,
       perCase: option.per_case
     }
   })


   const defaultPackageOption = 1;
   let totalPackagingPrice = 0
   let nftPackageOptions: any = []
   for (const nftDetail of nftDetails) {
     let numberOfBottles = 0;
     let availableOptions: any = []


     if (nftDetail?.nft_details?.pallete?.packaging_type?.id) {
       const { cardboard, styrofoam, crd_wood, sty_wood, vin_liner } = nftDetail.nft_details.pallete.packaging_type;


       if (cardboard) {
         availableOptions.push(1);
       }
       if (styrofoam) {
         availableOptions.push(2);
       }
       if (crd_wood) {
         availableOptions.push(3);
       }
       if (sty_wood) {
         availableOptions.push(4);
       }
       if (vin_liner) {
         availableOptions.push(5);
       }
     } else {
       availableOptions = [1, 2, 3, 4, 5]
     }
     if (nftDetail.price_at_drop > 5000) {
       availableOptions = availableOptions.filter((item: any) => item !== 1)
     }


     if (nftDetail.nft_details.no_of_bottles) {
       numberOfBottles = nftDetail.nft_details.no_of_bottles
     }


     const nftPackageOption = nfts.find((elem: any) => +elem.id === +nftDetail.nft_token_id)
     let nftPackageOptionId = nftPackageOption?.packageOptionId
       ? nftPackageOption.packageOptionId
       : defaultPackageOption


     nftPackageOptions.push({
       nft_id: nftDetail.nft_token_id,
       availableOptions,
       currentOption: nftPackageOptionId,
     })


     const packageOption: any = await DbModel.PackageOptionModel.findOne({
       where: { option_id: nftPackageOptionId },
       nest: true,
     })


     //https://zira.zstream.io/app/tasks/task/WNC-1394
     // if (packageOption.per_case) {
     //   totalPackagingPrice += packageOption.price_eur
     // } else {
     //   totalPackagingPrice += packageOption.price_eur * numberOfBottles
     // }
   }


   const result = {
     packageOptions,
     nftPackageOptions,
     totalPackagingPrice,
   }


   return result
 }


 public async burnAndShip(data: any) {


   try {
     let orderId = await DbModel.NftDetailModel.findOne({
       attributes: [[DbModel.sequelize.fn('max', DbModel.sequelize.col('order_id')), 'order_id']],
       raw: true,
     })
     let order: any = {
       id: ++orderId.order_id,
       nftShipments: []
     }


     const nftIds = data.nfts.map((item: any) => {
       return item.id
     })


     const packagingOptions = await this.getDeliveryOptions({
       nfts: data.nfts,
       userId: data.userId,
       shippingSettings: data.shippingSettings,
     })


     const ShippingCountry: any = await UserHelper.getShippingCountry(data.shippingSettings.country, data.shippingSettings.state)


     //step 1
     const shipmentData = {
       destAddress: { ...data.shippingSettings, state_code: ShippingCountry.state_code },
       packages: packagingOptions.deliveryDetails.packages,
       nbBottles: packagingOptions.deliveryDetails.nbBottles,
       user: data.userData,
       carrier: packagingOptions?.shippingOptions?.[data.shippingType]?.carrier,
       palette: packagingOptions.deliveryDetails.palletized,
       nftIds
     }


     let resultShipment: any = await LogisticService.createShipment(shipmentData)


     console.log('resultShipment', resultShipment)


     //step 2


     const shippingOptions = packagingOptions.shippingOptions
     const shippingType = shippingOptions.express ? shippingOptions.express : shippingOptions.econom
     const totalPackagingPrice = shippingType.totalPackagingPriceCurent
     const shippingPrice = shippingType.shippingPrice
     const insurancePrice = shippingType.insurance
     const taxesandfeesPrice = shippingType.dutiesTaxesCurent
     const vatPrice = shippingType.vat


     let shippingObj = {
       pre_order_id: order.id,
       dest_address_info: data.shippingSettings,
       nft_package_options: data.nfts,
       shipments_data: (data.shippingType == 'econom') ? packagingOptions.shippingOptions.econom?.carrier : packagingOptions.shippingOptions.express?.carrier,
       shipment_id: resultShipment?.data?.shipment?.id,
       tracking_number: resultShipment?.data?.shipment?.codeTracking,
       label: resultShipment?.data?.shipment?.label?.directLink,
       total_packaging_price: totalPackagingPrice,
       shipping_price: shippingPrice,
       insurance_price: insurancePrice,
       taxesandfees_price: taxesandfeesPrice,
       tracking_link: '',
       errors: {},
       vat_price: vatPrice,
       payment_status: this.PAYMENT_STATUSES.NotPaid
     }


     let allErrors = {
       hasErrors: false,
       resultShipment: {
         status: '',
         code: '',
         message: '',
         params: {}
       },
       resultTrackingLink: {
         status: '',
         code: '',
         message: ''
       }
     };
     if (resultShipment.error) {
       allErrors.hasErrors = true
       allErrors.resultShipment.status = resultShipment.status
       allErrors.resultShipment.code = resultShipment.code
       allErrors.resultShipment.message = resultShipment.message
       allErrors.resultShipment.params = resultShipment.params
       shippingObj.pre_order_id = `${shippingObj.pre_order_id}-error-${new Date().getTime()}`
       shippingObj.payment_status = this.PAYMENT_STATUSES.Error
     } else {
       const resultTrackingLink: any = await LogisticService.getTrackingLink(resultShipment?.data?.shipment?.id)
       if (resultTrackingLink.error) {
         allErrors.hasErrors = true
         allErrors.resultTrackingLink.status = resultTrackingLink.status
         allErrors.resultTrackingLink.code = resultTrackingLink.code
         allErrors.resultTrackingLink.message = resultTrackingLink.message
       } else {
         shippingObj.tracking_link = resultTrackingLink?.data?.trackingLink
       }
     }
     if (allErrors.hasErrors) {
       shippingObj.errors = allErrors
     }


     const shippingOrderDetailsModel: TypeShippingOrderDetails = await DbModel.ShippingOrderDetailsModel.create(shippingObj)


     if (resultShipment.error) {
       throw new Error('Shipping Order not created')
     }


     for (let nftId of nftIds) {
       let physicalId = await physicalIdHelper.createByNftId(nftId)


       order.nftShipments.push({
         nftId: + nftId,
         shipmentId: resultShipment?.data?.shipment?.id,
         physicalId
       })
     }


     for (let nftShipment of order.nftShipments) {
       await DbModel.NftDetailModel.update(
         {
           orderId: shippingOrderDetailsModel.id,
           physical_id: nftShipment.physicalId,
           // status_delivery: NftHelper.STATUS_DELIVERY_OPTIONS.PREPARING
         },
         {
           where: {
             nft_token_id: nftShipment.nftId,
           },
         }
       )
     }


     return {
       error: false,
       shipment_id: resultShipment?.data?.shipment?.id,
     };
   } catch (error: any) {
     return {
       message: error.message,
       shipment_id: null,
       error: true
     }
   }
 }


 public async completeShipment(shipmentId: any) {
   console.log('completeShipment shipmentId', shipmentId)
   const shippingOrderDetailsModel: TypeShippingOrderDetails = await DbModel.ShippingOrderDetailsModel.findOne({
     where: {
       shipment_id: shipmentId,
     },
     raw: true,
   })


   let nftIds = []


   for (let nftPackageOption of shippingOrderDetailsModel.nft_package_options) {
     nftIds.push(nftPackageOption.id)
   }


   await DbModel.ShippingOrderDetailsModel.update(
     {
       payment_status: this.PAYMENT_STATUSES.Paid
     },
     {
       where: {
         shipment_id: shipmentId,
       },
     }
   )


   await SendPulseHelper.sendUserShipmentComplete(nftIds[0])
   for (let nftId of nftIds) {
     await DbModel.NftDetailModel.update(
       {
         status_delivery: NftHelper.STATUS_DELIVERY_OPTIONS.PREPARING,
         requestedToBurnDate: shippingOrderDetailsModel.createdAt
       },
       {
         where: {
           nft_token_id: nftId,
         },
       }
     )
   }


   const outboundRequestFileName = `outbound_request_${shipmentId}_${new Date().getTime()}.xlsx`
   const path = `logistics/outbound_requests/${shipmentId}/`




   let { buffer } = await xlsxHelper.createOutboundRequest(shippingOrderDetailsModel, nftIds)


   let outboundRequestFile = await FileHelper.fileUpload({ buffer: buffer, name: `${outboundRequestFileName}`, path: `${path}`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })


   console.log('outboundRequestFile', outboundRequestFile)


   let attachments = [
     {
       filename: outboundRequestFile.name,
       path: outboundRequestFile.url
     },
   ]


   if (shippingOrderDetailsModel.label) {
     let pdfBuffer = await PdfHelper.downloadPDF(`${shippingOrderDetailsModel.label}`)


     const labelFileName = `label_${shipmentId}_${new Date().getTime()}.pdf`


     let labelFile = await FileHelper.fileUpload({ buffer: pdfBuffer, name: `${labelFileName}`, path: `${path}`, contentType: 'application/pdf' })


     console.log('labelFile', labelFile)


     attachments.push(
       {
         filename: labelFile.name,
         path: labelFile.url
       },
     )
   }


   for (let nftId of nftIds) {
     const path = `logistics/QrCodes/${nftId}/`
     const link = `${process.env.BASE_URL}wineft-details/${nftId}`


     //1 - QR with logo but in pdf format
     const QrCodePdf = await PdfHelper.createQrCode(link)
     const QrCodePdfFileName = `QrCode_${nftId}_${new Date().getTime()}.pdf`
     let QrCodePdfFile = await FileHelper.fileUpload({ buffer: QrCodePdf, name: `${QrCodePdfFileName}`, path: `${path}`, contentType: 'application/pdf' })


     attachments.push(
       {
         filename: QrCodePdfFile.name,
         path: QrCodePdfFile.url
       },
     )


     // 2 - QR without logo but in svg format
     // const QrCodeSvg = await PdfHelper.createQrCodeToSVG(link)
     // const QrCodeFileName = `QrCode_${nftId}_${new Date().getTime()}.svg`
     // let QrCodeSvgFile = await FileHelper.fileUpload({ buffer: QrCodeSvg, name: `${QrCodeFileName}`, path: `${path}`, contentType: 'image/svg' })


     // attachments.push(
     //   {
     //     filename: QrCodeSvgFile.name,
     //     path: QrCodeSvgFile.url
     //   },
     // )
   }


   await MailHelper.sendEmail({
     attachments: attachments,
     to: [process.env.WAREHOUSE_EMAIL, process.env.WAREHOUSE2_EMAIL, process.env.LOGISTIC_MAIL],
     subject: `WineChain customer shipping details`,
     html: `<p>Greetings from WineChain,</p><br/>
     <p>Please find attached the outbound order request. This details the shipment from the storage facility to the customer address.</p>
     <p>In case of any questions, please don\'t hesitate to contact us at  <a href = "mailto:contact@winechain.co">contact@winechain.co</a></p>
     <p>Thank you,</br>The WineChain Team.</p>`
   })


   return { error: false }
 }






 public async cancelShipment(shipmentId: any) {


   const shippingOrderDetailsModel: TypeShippingOrderDetails = await DbModel.ShippingOrderDetailsModel.findOne({
     where: {
       shipment_id: shipmentId,
     },
     raw: true,
     nest: true,
   })


   let nftIds = []


   for (let nftPackageOption of shippingOrderDetailsModel.nft_package_options) {
     nftIds.push(nftPackageOption.id)
   }


   await DbModel.NftDetailModel.update(
     {
       orderId: null,
       physical_id: null,
       status_delivery: NftHelper.STATUS_DELIVERY_OPTIONS.IN_STORAGE
     },
     {
       where: { nft_token_id: { [Op.in]: nftIds } },
     }
   )


   await DbModel.ShippingOrderDetailsModel.update(
     {
       payment_status: this.PAYMENT_STATUSES.Cancelled
     },
     {
       where: {
         shipment_id: shipmentId,
       },
     }
   )


   try {
     await LogisticService.cancelShipment(shipmentId)
   } catch (er: any) {
     return { error: false }
   }


   return { error: false }
 }




}
export default new LogisticHelper()

