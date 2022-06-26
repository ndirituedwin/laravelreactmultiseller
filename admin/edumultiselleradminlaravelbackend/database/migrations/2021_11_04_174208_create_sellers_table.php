<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSellersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->string('seller_name');
            $table->bigInteger('shop_id');
            $table->string('seller_email');
            $table->string('seller_phone');
            $table->tinyInteger('is_enabled')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('shop_id')->references('id')->on('shops')->onDelete('restrict')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sellers');
    }
}
