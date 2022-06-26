<?php

use App\Http\Controllers\Front\Auth\AuthController;
use App\Http\Controllers\Front\Products\CartController;
use App\Http\Controllers\Front\Products\IndexController;
use App\Http\Controllers\Front\Products\ProductlistingController;
use App\Http\Controllers\Front\Products\SingleProductDetailsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
    Route::prefix('front')->namespace('Frontend')->group(function(){
    Route::post('/multiseller/auth/createuser', [AuthController::class,'register']);
    Route::post('/multiseller/auth/login', [AuthController::class,'login']);
    Route::middleware(['auth:api'])->group(function () {
        Route::get('/multiseller/auth/getprincipal', [AuthController::class,'user']);
        Route::post('/multiseller/auth/logout', [AuthController::class,'logout']);
        Route::post('/multiseller/add_to_cart', [CartController::class,'addtocart']);
        Route::get('/multiseller/view-cart', [CartController::class,'viewcart']);
        Route::get('/multiseller/view/single-product-id/{id}', [CartController::class,'singleproductpage']);
        Route::post('/multiseller/view/cartitem-dicountedprice-id/{productid}', [CartController::class,'dicountedpriceforeachcartitem']);

    });


    Route::get('/multiseller/view/home', [IndexController::class,'homepage']);
    Route::get('/multiseller/view/featured', [IndexController::class,'featured']);
    Route::get('/multiseller/view/latestproducts', [IndexController::class,'latestproducts']);
    Route::get('/multiseller/view/view-brands', [IndexController::class,'fetchbrands']);
    Route::get('/multiseller/view/single-product/{slug}', [SingleProductDetailsController::class,'singleproductpage']);
    Route::post('/multiseller/stock_based_of_product_size/{id}', [SingleProductDetailsController::class,'stock_based_of_product_size']);
    Route::get('/multiseller/view/products-byctegory/{slug}', [ProductlistingController::class,'listing']);
    Route::get('/multiseller/view/view-products-bybrand/{slug}', [ProductlistingController::class,'listingproductsbybrand']);
    Route::post('/multiseller/view/sort-products/{slug}', [ProductlistingController::class,'sortproducts']);


});
