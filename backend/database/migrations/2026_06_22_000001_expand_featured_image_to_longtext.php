<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE products MODIFY featured_image LONGTEXT NOT NULL');
            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE products ALTER COLUMN featured_image TYPE TEXT');
            return;
        }

        // SQLite does not enforce VARCHAR length, so no change is required.
        if ($driver === 'sqlite') {
            return;
        }

        // Fallback for other drivers where column modification is supported.
        Schema::table('products', function (Blueprint $table) {
            $table->longText('featured_image')->change();
        });
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE products MODIFY featured_image VARCHAR(255) NOT NULL');
            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE products ALTER COLUMN featured_image TYPE VARCHAR(255)');
            return;
        }

        if ($driver === 'sqlite') {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            $table->string('featured_image')->change();
        });
    }
};
