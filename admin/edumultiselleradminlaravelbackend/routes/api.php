<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Brand\BrandController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\ForgotPasswordController as AdminForgotPasswordController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\Admin\Section\SectionController;
use App\Http\Controllers\Auth\Implemented\ForgotPasswordController;
use App\Http\Controllers\Auth\Implemented\AuthController;
use App\Models\Category;
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
/*
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::prefix('auth')->group(function () {
    Route::post('multiseller/login', [AuthController::class,'login']);
    Route::post('multiseller/register', [AuthController::class,'register']);
    Route::post('multiseller/forgot', [ForgotPasswordController::class,'forgot']);
        Route::middleware(['auth:api'])->group(function () {
            Route::get('multiseller/user', [AuthController::class,'user']);
            Route::post('multiseller/reset', [ForgotPasswordController::class,'reset']);
        });
});*/

Route::prefix('admin')->namespace('Admin')->group(function(){
    Route::post('multiseller/login', [AdminController::class,'login']);
    Route::post('multiseller/register', [AdminController::class,'register']);
    Route::post('multiseller/forgot', [AdminForgotPasswordController::class,'forgot']);

    Route::middleware(['auth:api-admins'])->group(function () {
        /** admin authentication */
        Route::get('multiseller/admin', [AdminController::class,'admin']);
        Route::post('multiseller/reset', [AdminForgotPasswordController::class,'reset']);
        Route::post('multiseller/logout', [AdminController::class,'logoutdmin']);
        /**end of admin authentication */
        /** sections */

        Route::post('multiseller/sections/addsection', [SectionController::class,'save']);
        Route::get('multiseller/sections/viewsections', [SectionController::class,'viewsections']);
        Route::get('multiseller/sections/fetchshops', [SectionController::class,'fetchshops']);
        Route::get('multiseller/sections/restore/{slug}', [SectionController::class,'restore']);
        Route::get('multiseller/sections/trashedsections', [SectionController::class,'trashedsections']);
        Route::get('multiseller/sections/edit-section/{slug}', [SectionController::class,'editsectionbyslug']);
        Route::put('multiseller/sections/update-section/{slug}', [SectionController::class,'updatesectionbyslug']);
        Route::delete('multiseller/sections/delete-section/{slug}', [SectionController::class,'deletesectionbyslug']);
        Route::delete('multiseller/sections/forcedelete-section/{slug}', [SectionController::class,'forcedelete']);
        Route::put('multiseller/sections/update-section-status/{slug}', [SectionController::class,'updatesectionstatusbyslug']);

        /**end of  section */
          /** brands */
          Route::post('multiseller/brands/addbrand', [BrandController::class,'save']);
          Route::get('multiseller/brands/viewbrands', [BrandController::class,'viewbrands']);
          Route::get('multiseller/brands/restore/{slug}', [BrandController::class,'restore']);
          Route::get('multiseller/brands/trashedbrands', [BrandController::class,'trashedbrands']);
          Route::get('multiseller/brands/edit-brand/{slug}', [BrandController::class,'editbrandbyslug']);
          Route::put('multiseller/brands/update-brand/{slug}', [BrandController::class,'updatebrandbyslug']);
          Route::delete('multiseller/brands/delete-brand/{slug}', [BrandController::class,'deletebrandbyslug']);
          Route::delete('multiseller/brands/forcedelete-brand/{slug}', [BrandController::class,'forcedelete']);
          Route::put('multiseller/brands/update-brand-status/{slug}', [BrandController::class,'updatebrandstatusbyslug']);
          /**end of  brands */
          /** category */
          Route::post('multiseller/categories/addcategory', [CategoryController::class,'save']);
          Route::get('multiseller/categories/restore/{slug}', [CategoryController::class,'restore']);
          Route::get('multiseller/categories/fetchsections', [CategoryController::class,'fetchsections']);
          Route::get('multiseller/categories/viewcategories', [CategoryController::class,'viewcategories']);
          Route::get('multiseller/categories/sectioncategories/{id}', [CategoryController::class,'sectioncategories']);
          Route::get('multiseller/categories/trashedcategories', [CategoryController::class,'trashedcategories']);
          Route::get('multiseller/categories/edit-category/{slug}', [CategoryController::class,'editcategorybyslug']);
          Route::post('multiseller/categories/update-category/{slug}', [CategoryController::class,'updatecategorybyslug']);
          Route::delete('multiseller/categories/delete-category/{slug}', [CategoryController::class,'deletecategorybyslug']);
          Route::delete('multiseller/categories/forcedelete-category/{slug}', [CategoryController::class,'forcedelete']);
          Route::put('multiseller/categories/update-category-status/{slug}', [CategoryController::class,'updatecategoriestatusbyslug']);
          /**end of  category */
                /** Product */
                Route::post('multiseller/products/addproduct', [ProductController::class,'save']);
                Route::get('multiseller/products/restore/{slug}', [ProductController::class,'restore']);
                Route::get('multiseller/products/fetchsectioncategories', [ProductController::class,'sectioncategories']);
                Route::get('multiseller/products/viewproducts', [ProductController::class,'viewproducts']);
                Route::get('multiseller/products/sectionproducts/{id}', [ProductController::class,'sectionproducts']);
                Route::get('multiseller/products/trashedproducts', [ProductController::class,'trashedproducts']);
                Route::get('multiseller/products/edit-product/{slug}', [ProductController::class,'editproductbyslug']);
                Route::post('multiseller/products/update-product/{slug}', [ProductController::class,'updateproductbyslug']);
                Route::delete('multiseller/products/delete-product/{slug}', [ProductController::class,'deleteproductbyslug']);
                Route::delete('multiseller/products/forcedelete-product/{slug}', [ProductController::class,'forcedelete']);
                Route::delete('multiseller/products/forcedelete-product-attribute/{slug}', [ProductController::class,'forcedeleteproductattribute']);
                Route::put('multiseller/products/update-product-status/{slug}', [ProductController::class,'updateproductstatusbyslug']);
                Route::put('multiseller/products/update-product-attribute-status/{slug}', [ProductController::class,'updateproductattributestatusbyslug']);
                Route::get('multiseller/products/get-add-product-attribute/{slug}', [ProductController::class,'fetchprouctandattributes']);
                Route::post('multiseller/products/save-product-attribute/{slug}', [ProductController::class,'saveproductattributes']);
                Route::post('multiseller/products/dec-product-attribute-price/{slug}', [ProductController::class,'decproattrprice']);
                Route::post('multiseller/products/inc-product-attribute-price/{slug}', [ProductController::class,'incproattrprice']);
                Route::post('multiseller/products/inc-product-attribute-stock/{slug}', [ProductController::class,'incproattrstock']);
                Route::post('multiseller/products/dec-product-attribute-stock/{slug}', [ProductController::class,'decproattrstock']);
                Route::get('multiseller/products/getadd-multiple-product-images/{slug}', [ProductController::class,'getaddmultipleproductimages']);
                Route::post('multiseller/products/save-multiple-product-images/{slug}', [ProductController::class,'savemultipleimages']);
                Route::put('multiseller/products/update-multiple-product-images-status/{id}', [ProductController::class,'updamuteltipleimagesstatus']);
                Route::delete('multiseller/products/delete-multiple-product-images/{id}', [ProductController::class,'deletemuteltipleimages']);
                /**end of  Product */
    });
});