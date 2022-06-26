<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('admin_id');
            $table->bigInteger('parent_id');
            $table->bigInteger('section_id');
            $table->string('category_name');
            $table->string('slug');
            $table->float('category_discount',8,2);
            $table->text('description')->nullable();
            $table->string('category_image')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->tinyInteger('is_enabled')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index('admin_id');
            $table->index('section_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('restrict')->onUpdate('cascade');
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
        Schema::dropIfExists('categories');
    }
}
