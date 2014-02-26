
[![Build Status](https://travis-ci.org/Nascotix/ProFTPd-Manager.png?branch=master)](https://travis-ci.org/Nascotix/ProFTPd-Manager)


# ProFTPd Manager

ProFTPd Manager est un outil de gestion des utilisateurs et des groupes de votre serveur ProFTPd via une toute nouvelle interface web au design épuré. ProFTPd manager se veut simple d'utilisation.
Vous avez la possibilité de spécifier la configuration de votre base de donnée soit en ligne de commande soit via un fichier de configuration JSON.

Si vous voulez avoir des renseignements supplémentaires sur proFTPd, consultez leur [site web](http://www.proftpd.org/).

## Installation

L'installation de ProFTPd Manager n'est pas très compliquée. Elle se fait par l'intermédiaire du gestionnaire de paquets NPM.

```
[sudo] npm install -g prodftp-manager
```

## Usage

Comme explicité précédemment, il vous est possible de réécrire par dessus la configuration de base. Soit par un fichier de configuration JSON soit en ligne de commande

### Configuration de base

```js
model: {
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'proftpd',
    charset  : 'utf8'
  }
}
```

### Fichier de configuration JSON

Créez un fichier de configuration JSON où vous le voulez. Ce fichier ne doit contenir aucun commentaire, uniquement du JSON. Portez une attention toute particulière à la syntaxe à utiliser!

Par exemple :

```js
{
  "model": {
    "connection": {
      "host": "localhost"
    }
  },
  "port": "8080"
}
```

Vous pouvez ensuite lancer le programme avec la commande suivante

```js
proftpd-manager --json votrefichierJSON
```

### En ligne de commande

C'est une autre manière de configurer vos paramètres. Vous pouvez en effet spécifier des arguments au lancement du programme.

```js
// Pour modifier l'hôte
proftpd-manager --model-connection-host 127.0.0.1

//Pour modifier le mot de passe
proftpd-manager --model-connection-password votremotdepasse

```

### Liste complète des commandes

```
Usage: proftpd-manager

Options:
  --model-client                  Client de la base de donnée (ex: mysql)
  --model-connection-host         Adresse IP de la base de données
  --model-connection-user         Utilisateur de la base de données
  --model-connection-password     Mot de passe utilisateur
  --model-connection-database     Table à laquelle on se connecte
  --model-connection-charset      Charset utilisé par la base de données
  --json                          Prend un fichier JSON en argumment
  --port                          Port utilisé pour la web application
```

## License

ProFTPd Manager est sous license MIT.