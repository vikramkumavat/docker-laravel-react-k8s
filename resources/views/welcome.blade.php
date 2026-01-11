<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        {{-- Webpack (Laravel Mix) CSS --}}
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    </head>
    <body>
        <div id="app"></div>

        {{-- Webpack (Laravel Mix) JS --}}
        <script src="{{ mix('js/app.js') }}" defer></script>
    </body>
</html>
