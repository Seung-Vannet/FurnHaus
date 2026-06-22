<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->string('sku')->unique()->nullable();
            $table->integer('quantity')->default(0);
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('material')->nullable();
            $table->string('color')->nullable();
            $table->string('dimensions')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->longText('featured_image');
            $table->json('gallery_images')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);
            $table->enum('stock_status', ['in_stock', 'low_stock', 'out_of_stock'])->default('in_stock');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();
            
            $table->index('category_id');
            $table->index('price');
            $table->index(['is_active', 'is_featured']);
            $table->index('stock_status');
            // Fulltext search will use LIKE queries for SQLite compatibility
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
