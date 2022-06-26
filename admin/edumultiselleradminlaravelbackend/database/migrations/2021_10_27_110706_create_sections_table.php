<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id');
            $table->string('section');
            $table->foreignId('shop_id');
            $table->string('slug');
            $table->tinyInteger('is_enabled')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('restrict')->onUpdate('cascade');
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
        Schema::dropIfExists('sections');
    }
}