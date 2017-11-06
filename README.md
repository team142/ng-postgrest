# NgPostgrest - Angular Postgrest

The goal of this project is to build a simple Angular UI client for Postgrest (Postgrest is a REST wrapper for PostgresSQL. [See Postgrest]: https://postgrest.com). The central idea of the project is to create a simple web interface for managing and editing PostgresSQL data over Postgrest as an interface.

![Logo](docs/screenshot.PNG "Logo")


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

### Next to be implemented

  - Insert new row
  - Simple queries (AND only)


### Planned

  - Complex queries (Support for AND, OR)
  - Security headers
  - Persisting defaults
  - Saving & loading settings (Google drive)





