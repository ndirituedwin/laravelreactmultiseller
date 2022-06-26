<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('seller_id')->unsigned()->default(1);
        $table->bigInteger('shop_id')->unsigned()->default(1);
            $table->bigInteger('section_id')->unsigned();
            $table->bigInteger('brand_id')->unsigned();
            $table->bigInteger('category_id')->unsigned();
            $table->string('product_name');
            $table->string('slug');
            $table->string('product_code');
            $table->float('product_price');
            $table->float('product_discount')->default(0.0);
            $table->text('product_description');
            $table->string('product_image');
            $table->string('product_color')->nullable();
            $table->string('product_weight')->nullable();
            $table->string('wash_care')->nullable();
            $table->string('fabric')->nullable();
            $table->string('pattern')->nullable();
            $table->string('sleeve')->nullable();
            $table->string('fit')->nullable();
            $table->string('occassion')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->tinyInteger('is_featured')->default(0);
            $table->tinyInteger('is_enabled')->default(0);
            $table->index('category_id');
            $table->index('seller_id');
            $table->index('shop_id');
            $table->index('section_id');
           $table->index('brand_id');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('shop_id')->references('id')->on('shops')->onDelete('restrict')->onUpdate('cascade');
           $table->foreign('brand_id')->references('id')->on('brands')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('section_id')->references('id')->on('sections')->onDelete('restrict')->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
