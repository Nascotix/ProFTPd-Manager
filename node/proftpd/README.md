ProFTPd Manager
===============

ProFTPd Manager est un outil de gestion des utilisateurs et des groupes d'un ProFTPd. Vous avez la possibilité de spécifier la configuration de votre base de donnée soit en ligne de commande soit via un fichier de configuration JSON.

Si vous voulez avoir des renseignements supplémentaires sur proFTPd, consultez leur [site web](http://www.proftpd.org/).

Installation
------------

L'installation de ProFTPd Manager n'est pas très compliquée.

```
[sudo] npm install -g prodftp-manager
```

Usage
-----

Comme explicité précédemment, il vous est possible de réécrire par dessus la configuration de base. Soit par fichier de configuration JSON soit en ligne de commande

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
./bin/proftpd-manager --json votrefichierJSON
```

### En ligne de commande

C'est une autre manière de configurer vos paramètres. Vous pouvez en effet spécifier des arguments au lancement du programme.

```js
// Pour modifier l'hôte
./bin/proftpd-manager --model-connection-host 127.0.0.1

//Pour modifier le mot de passe
./bin/proftpd-manager --model-connection-password votremotdepasse

```


Voici la liste complète des commandes

```
Usage: proftpd-manager

Options:
  --model-client                  Spécifie le client de la base de donnée (mysql)                [string]
  --model-connection-host         Adresse IP de la base de données                               [string]
  --model-connection-user         Utilisateur de la base de données                              [string]
  --model-connection-password     Mot de passe de l'utilisateur                                  [boolean]
  --model-connection-database     Table à laquelle on se connecte                                [boolean]
  --model-connection-charset      charset utilisé par la base de données                         [boolean]
  --json                          Prend un fichier JSON en argumment                             [file]
  --port                          Port d'écoute de l'application                                 [integer]
```

License
-------
ProFTPd Manager is released under the MIT license.