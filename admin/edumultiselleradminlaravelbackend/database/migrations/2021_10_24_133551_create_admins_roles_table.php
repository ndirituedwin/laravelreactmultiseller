<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins_roles', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('admin_id');
            $table->string('module');
            $table->tinyInteger('view_access')->default(0);
            $table->tinyInteger('edit_access')->default(0);
            $table->tinyInteger('delete_access')->default(0);
            $table->tinyInteger('full_access')->default(0);
            $table->timestamps();
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('restrict')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admins_roles');
    }
}