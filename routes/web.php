<?php 
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app'); // This serves your main Vue app
});

// Define routes for specific Vue components
Route::get('/dashboardTutors', function () {
    return view('app'); 
});

Route::get('/dashboard', function () {
    return view('app'); 
});

Route::get('/Auth', function () {
    return view('app'); 
});

