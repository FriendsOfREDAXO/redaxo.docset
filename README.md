# REDAXO Docset

![](https://raw.githubusercontent.com/FriendsOfREDAXO/redaxo.docset/assets/assets/dash-screenshot.png)

Ein "Dash-Docset" für die Redaxo-API-Doku.
[Dash](http://kapeli.com/dash/) ist ein API-Browser für den Mac (und iOS).

Für Windows und Linux gibt es ähnliche Programme, die auch Docsets verarbeiten können (habe ich aber nicht getestet). Docsets gibt es für mehr als 200 APIs (JavaScript, PHP, HTML, VueJS, Python ... uswusf) und es gibt mehr als 100 Cheat-Sheets zu allen möglichen Themen (RegEx, Tmux, HTTP Statuscodes ... uswusf, auch sehr praktisch).

## English

A Dash docset for REDAXO Content Management System.
About Dash (from the website):

> Dash is an API Documentation Browser and Code Snippet Manager. Dash stores snippets of code and instantly searches offline documentation sets for 200+ APIs, 100+ cheat sheets and more. You can even generate your own docsets or request docsets to be included.

It's only available for Mac but there are ports for Windows and Linux as well (haven't tested, see below).

### Docset generation

You'll need Python 3.7, Beautiful Soup and urllib3 installed on your machine.
The most simple way is to install [Pipenv](https://pipenv.readthedocs.io/en/latest/), setup a new virtual environment with
```bash
pipenv install
```
and then just run
```bash
pipenv run python generate.py
```
That's it!


## Links

- [Dash](http://kapeli.com/dash/)
- [Velocity](http://velocity.silverlakesoftware.com/) (Windows clone)
- [Zeal](https://zealdocs.org/) (Linux clone)
- [DevDocs](https://devdocs.io/) (also an API browser, but no REDAXO)
