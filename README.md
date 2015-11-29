# crispy-tatertot

A program to facilitate secure, motivational internet conversations.

[![Build Status](https://travis-ci.org/couragelabs/crispy-tatertot.svg?branch=master)](https://travis-ci.org/couragelabs/crispy-tatertot)

## Usage

### Setup Docker (Mac)

```
brew install docker docker-machine
```
Then choose between the following two commands depending on whether or not you need to create it for the first time or start running your docker-machine now

```
docker-machine create -d virtualbox dev # 
docker-machine start dev 
```

```
eval "$(docker-machine env dev)"
export DEV_HOST=`docker-machine ip dev`
export TATER_DB_URL=jdbc:mysql://$DEV_HOST/taters
```
```
cd docker/taters-db
docker build -t taters-db .
docker run --name taters-db -p 3306:3306 -d taters-db
```

### Database setup
```
brew install mysql
```

### Run the application locally with auto-reload

```
lein ring server
```

### Connect to the database locally
```
eval "$(docker-machine env dev)"
export DEV_HOST=`docker-machine ip dev`
mysql -h $DEV_HOST -u tater_dev -p taters
```

### Packaging and running as standalone jar like Heroku does
Install the [Heroku Toolbelt](https://toolbelt.heroku.com/), then:

```
lein do clean, ring uberjar && heroku local web
```

## License

    Copyright © 2015, Courage Labs, LLC.
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
