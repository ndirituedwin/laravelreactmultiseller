<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('role_id');
            $table->string('mobile');
            $table->string('email');
            $table->string('avatar')->nullable();
            $table->tinyInteger('is_enabled')->default(0);
            $table->string('password');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('restrict')->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admins');
    }
}
