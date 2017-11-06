# NgPostgrest - Angular Postgrest

This project was is a simple Angular UI client for Postgrest. Postgrest is a REST wrapper for PostgresSQL. The central idea of the project is to create a simple web interface for managing and editing PostgresSQL data over Postgrest as an interface.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `./build.sh` to build the project or
Run `ng build --prod --aot=false` .

## Features

### Completed

  - Managing Postgrest endpoints
  - Table selection
  - Table pagination
  - Table pagination size
  - Update row (**currently testing for non-text fields**)
  - Delete row (with confirmation)


### Planned

  - Simple queries (AND only)
  - Complex queries (Support for AND, OR)
  - Insert new row
  - Security headers
  - Persisting default
  - Saving & loading settings (Google drive)

### Alpha

![Logo](docs/screenshot.PNG "Logo")





