# crispy-tatertot

A program to facilitate secure, motivational internet conversations.

[![Build Status](https://travis-ci.org/couragelabs/crispy-tatertot.svg?branch=master)](https://travis-ci.org/couragelabs/crispy-tatertot)

## Usage

### Setup Docker (Mac)

```
brew install docker docker-machine
docker-machine create -d virtualbox dev
eval "$(docker-machine env dev)"
export DEV_HOST=`docker-machine ip dev`
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -e MYSQL_DATABASE=taters -e MYSQL_USER=tater_dev \
  -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql:latest

```

### Database setup
```
brew install mysql
mysql -h $DEV_HOST -u tater_dev -p taters
CREATE DATABASE taters DEFAULT CHARACTER SET 'utf8';
GRANT ALL on taters.* TO tater_dev@'localhost' IDENTIFIED BY 'password';
```

### Run the application locally with auto-reload

`lein ring server`

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
    
