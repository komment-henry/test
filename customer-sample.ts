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

/**
* @description This function takes an array of objects representing shipment options
* and returns a sorted array of the objects based on their "price" property.
* 
* @param { any } data - The "data" input parameter is not used at all within the
* "getUserMedia()". Its purpose seems to be solely to pass values to functions and/or
* variables elsewhere.
* 
* @param { boolean } ignoreRestrictions - The `ignoreRestrictions` parameter is an
* optional `boolean` value that allows skipping the check for restricted packages
* if it is set to `true`.
* 
* @returns { object } The `compareByPrice` function takes two objects as parameters
* and compares their price attributes. If the first object's price is lower than the
* second object's price then the result will be negative. if the first object has a
* higher price than the second object then the result is positive and if the price
* of both objects is the same (i.e., identical) then 0 will be returned.
*/
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


/**
* @description This function takes a list of items (`data.nfts`) and returns a new
* list containing only the `id` property of each item.
* 
* @param { any } item - In the given function `data.nfts.map()`, the `item` input
* parameter is an anonymous function that takes an `any` type of item as its argument.
* 
* @returns { object } The function takes a list of `item` objects as input and returns
* a list of item IDs.
* 
* The function iterates over the list of items using `.map()` method and for each
* item it extracts the `id` property using the arrow function syntax `.((item: any)
* => { return item.id }).`.
* 
* Therefore the output of this function would be a new list containing only the IDs
* of the items from the original list.
*/
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

/**
* @description This function maps over an array of "option" objects and returns a
* new array of simplified object structures with the following properties:
* 
* 	- id (option_id)
* 	- name
* 	- description
* 	- images (with just the first image)
* 	- price (in EUR)
* 	- perCase
* 
* In other words: it filters out unnecessary properties from the input options and
* provides a more compact representation.
* 
* @param { any } option - In this function `option` is an array of objects each
* representing a package option.
* 
* @returns { object } The function takes an array of `any` objects and maps each
* object to a new object with specific properties.
*/
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
/**
* @description The given function takes the `availableOptions` array and returns a
* new array containing all items that are not equal to 1.
* 
* @param { any } item - In the provided code snippet `item` is the input parameter
* for the arrow function and it refers to each item inside the `availableOptions`
* array. The purpose of the function is to filter out any items that have a value
* of 1.
*/
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


/**
* @description The function is finding an element within the `data.nfts` array that
* has an `id` property equal to the `nft_token_id` passed as a parameter.
* 
* @param { any } elem - In the context of your code snippet`, the `elem` input
* parameter is the current element being iterated over within the `.find()` method's
* callback function.
*/
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
/**
* @description This function maps over an array of objects and creates a new object
* for each item with the properties:
* 
* 	- `nb`: the number of bottles
* 	- `weight`: the weight of the package
* 	- `width`: the width of the package
* 	- `height`: the height of the package
* 	- `length`: the length of the package
* 	- `bottleVolume`: the volume of each bottle
* 	- `price`: the price of the package
* 	- `fromApi`: a flag indicating if the price comes from an API
* 	- `packagingPrice`: the packaging price of the item (which is 0 if not specified)
* 
* The function also computes the total packaging price by summing up the packaging
* prices of all items.
* 
* @param { any } item - The `item` input parameter is an element of an array of
* objects that contains information about packages.
* 
* @returns { object } The output of this function is an array of objects containing
* information about each package. Each object has properties such as "nb", "weight",
* "width", "height", "length", "nbBottles", "bottleVolume", "price", and "packagingPrice".
* Additionally; the total packaging price is calculated and added to the object.
*/
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


/**
* @description This is an asynchronous JavaScript function called `getShipping` that
* takes four parameters: `packages`, `nbBottles`, `packagingPrice`, and `shippingObject`.
* It retrieves shipping rates from a logistic service and then processes the results
* to determine the most cost-effective option based on the packaging price.
* 
* @param { any } packages - The `packages` input parameter passed to the `getShipping()`
* function contains an array of objects representing the packages to be shipped.
* Each package object should contain a unique ID and the number of bottles being
* shipped for that package.
* 
* @param { any } nbBottles - Based on the name `nbBottles`, it seems that this
* parameter represents the number of bottles being shipped.
* 
* @param { any } packagingPrice - The `packagingPrice` input parameter is used to
* calculate the final cost of packaging for each shipping option (econom and express).
* 
* @param { any } shippingObject - The `shippingObject` input parameter is a reference
* to an object that will be filled with the shipping options (economy and express)
* returned by the function.
* 
* @returns { object } This function takes four arguments: `packages`, `nbBottles`,
* `packagingPrice`, and `shippingObject`. It returns an object with two properties:
* `econom` and `express`. These properties contain arrays of shipping options sorted
* by price (lowest to highest). The `econom` property contains options with delivery
* durations less than 10 days and the `express` property contains options with
* delivery durations greater than or equal to 10 days.
*/
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


/**
* @description This function prepares a result object for shipping calculations based
* on the given result array and packaging price. It sorts the result array by price
* and returns a combined object with the sorted array's name and shipping details
* (price and insurance). If the destination country is USA or UK and if EU wines are
* shipped outside of EU region and not fulfilled from a different location.
* 
* @param { any } resultArray - The `resultArray` input parameter is an array of
* objects that contains information about the shipping quotes retrieved from the
* carrier's API.
* 
* @param { any } packagingPrice - The `packagingPrice` input parameter represents
* the cost of packaging materials for shipping the bottles of wine.
* 
* @returns { object } The `prepareResult` function takes an array of objects and a
* packaging price as input. It performs the following tasks:
* 
* 1/ Sorts the array of objects based on their "price" property.
* 2/ Returns the first object from the sorted array.
* 3/ Calculates the shipping cost using a separate `calculationShippingCost` function.
* 4/ Updates the "shippingPrice" and "insurance" properties of the returned object
* with the calculated shipping cost.
* 5/ Calculates the total packaging price by adding the "packagingPrice" to the
* "shippingPackaging" property.
* 6/ Calculates the VAT and duties & taxes for the destination country based on its
* ISO code.
* 7/ Updates the "vat" and "dutiesTaxes" properties of the returned object with the
* calculated amounts.
* 8/ Returns the updated object with all the calculated properties.
* 
* The output of this function is an object with properties like "name", "service",
* "shippingPrice", "packagingPrice", "insurance", "vat", and "dutiesTaxes".
*/
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


/**
* @description This function calculates the shipping cost for a list of NFTs being
* sold to customers at different countries. It considers factors such as VAT rates
* for each country and calculates duties & taxes based on the NFT price and packaging
* costs.
* 
* @param { any } shippingPrice - The `shippingPrice` input parameter represents the
* cost of shipping the NFTs to the buyer.
* 
* @param { any } packagingPrice - The `packagingPrice` input parameter represents
* the cost of packaging and is used to calculate the total packaging price along
* with the vat and duties taxes.
* 
* @returns { object } The output returned by the `calculationShippingCost` function
* is an object containing several calculated fields related to shipping costs for a
* purchase of non-fungible tokens (NFTs).
*/
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


/**
* @description This function compares two objects based on their price attribute and
* returns an integer indicating the relative order of the objects. If the first
* object has a lower price than the second object; then the result will be negative.
*   If the first object has a greater price than the second object; then the result
* will be positive.
* 
* @param { any } a - In the function `compareByPrice(a: any)`.
* 
* @param { any } b - The `b` input parameter is used as a reference to compare against
* the `a` parameter.
* 
* @returns { integer } The output returned by this function is a sorted array of
* elements based on their price. If two elements have the same price (i.e., their
* price property values are identical), the function will return a result of 0 and
* keep both elements unchanged.
*/
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


/**
* @description This function retrieves and filters packaging options based on the
* user's NFTs and their associated drop details.
* 
* @param { any[] } nfts - The `nfts` input parameter is an array of NFT objects
* passed into the function.
* 
* @param { string } user_id - The `user_id` input parameter is not used anywhere
* within the given code snippet. Therefore I can confidently answer that the `user_id`
* input parameter has no effect on the functions behavior.
* 
* @returns { object } The output returned by this function is an object that contains
* three properties: `packageOptions`, `nftPackageOptions`, and `totalPackagingPrice`.
* 
* `packageOptions` is an array of objects representing the available packaging options
* for the bottles. Each object has the following properties: `id`, `name`, `description`,
* `images`, `price`, and `perCase`.
* 
* `nftPackageOptions` is an array of objects representing the available packaging
* options for the NFTs.
*/
 public async getPackagingOptions(nfts: any[] = [], user_id: string) {
   const nftDetails = await DbModel.NftDetailModel.findAll({
     where: {
       nft_token_id: {
/**
* @description The function takes an array of items (`nfts`) and returns a new array
* with only the `id` property of each item.
* 
* @param { any } item - In this function `nfts.map((item: any) => { ... }`, `item`
* is a reference to each item within the `nfts` array that is being processed by the
* `map()` method.
* 
* @returns { object } The function takes an array of items (`nfts`) and returns a
* new array containing only the `id` property of each item.
*/
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


/**
* @description This function maps over an array of `any` objects (represented as
* `packageOptionsRaw`) and transforms each object into a new object with properties
* `id`, `name`, `description`, `images`, `price`, and `perCase`.
* 
* @param { any } option - In the provided function`, the `option` input parameter
* is an element of the array `packageOptionsRaw` and it contains properties like
* `option_id`, `name`, `description`, `image`, `price_eur`, and `per_case`.
* 
* @returns { object } The function takes an array of `any` objects and returns an
* array of objects with the properties `id`, `name`, `description`, `images`, `price`,
* and `perCase`.
*/
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
/**
* @description The given function takes the `availableOptions` array and returns a
* new array with all elements except the one with value `1`.
* 
* @param { any } item - The `item` input parameter is not used or referenced anywhere
* within the function passed as the filter predicate. It is simply assigned to the
* variable name `item`.
*/
       availableOptions = availableOptions.filter((item: any) => item !== 1)
     }


     if (nftDetail.nft_details.no_of_bottles) {
       numberOfBottles = nftDetail.nft_details.no_of_bottles
     }


/**
* @description This function searches the `nfts` array for an element with a `id`
* property that equals the `nftTokenId` passed as an argument.
* 
* @param { any } elem - The `elem` input parameter is not used at all because it has
* type `any`, which means it will never satisfy the `===`.
*/
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


/**
* @description This is a Node.js function called `burnAndShip` that handles the
* process of burning and shipping NFTs (non-fungible tokens) after receiving user input.
* 
* @param { any } data - The `data` input parameter is an object that contains various
* properties related to the shipping order and NFTs being sent. It is used throughout
* the function to retrieve relevant information for creating the shipment.
*/
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


/**
* @description The function takes a list of `item` objects as input and returns a
* new list containing only the `id` property of each `item`.
* 
* @param { any } item - The `item` input parameter is a destructured variable from
* the `data.nfts` array that contains the current item being processed. It is
* type-casted to any due to the varargs syntax (`...items: any`).
* 
* @returns { array } The function takes an array of objects with a `Map` method as
* input and returns an array of item IDs.
* 
* Concisely: the function maps over each item and returns only the `id` property value.
*/
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


/**
* @description This function completeShipment handles the completion of a shipment
* process for a WineChain customer order. It searches for the relevant shipping
* details using the shipment ID and then generates outbound requests for each NFT
* associated with the shipment.
* 
* @param { any } shipmentId - The `shipmentId` input parameter is used to specify
* the id of the shipment to be completed.
* 
* @returns { object } This function takes a `shipmentId` as input and completes the
* shipment by generating PDFs and QR codes for each NFT included within that shipment.
* Additionally it sends out an email to three separate email addresses regarding the
* order details of wine shipment information.
*/
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






/**
* @description This function cancels a shipment by updating the corresponding Nft
* detail and shipping order details records and also attempting to cancel the shipment
* with the logistic service.
* 
* @param { any } shipmentId - The `shipmentId` input parameter is used to identify
* the specific shipment to be canceled.
* 
* @returns { object } The function `cancelShipment` takes a `shipmentId` as an input
* and returns an object with an `error` property. If any of the database operations
* fail or if the `LogisticService.cancelShipment()` method throws an error while
* cancelling the shipment(a try/catch block is used for this), then the `error`
* property of the returned object will be set to `true`. If all the database operations
* are successful and `LogisticService.cancelShipment()` method succeeds without any
* issues the `error` property of the returned object will be set to `false`.
*/
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




