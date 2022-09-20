# Approche

Application React qui permet de visualiser et faire des recherches sur le dataset opendata.paris.fr des rubriques de lieux de tournages.

## Méthode de recherche

Entre une approche d'un champ globale avec saisie des mots de recherches au clavier, et une approche avec plusieurs champs/filtres dédiés, j'ai choisis la seconde méthode. Le nombre de champs de recherche étant limité à 3, cela permet d'avoir une interface intuitive (l'utilisateur voit clairement la nature des infomrations à saisir) et permet aussi de proposer des listes de valeurs sélectionnables (l'utilisateur se voit suggérer ce qui est possible).

(L'autre solution avec un seul champ de saisie sera privilégié si le nombre de champs est important (~infini). Une solution que j'aurais implémenté dans ce cas aurait été de récupérer tous les enregistrements, sérialisés chacun d'eux puis faire un ```.include``` sur chacun des mots. En attribuant un poid aux résultats, on peut présenter les résultats triés par pertinence.)

## Exécution de la recherche

Il y avait au moins deux options : sélection puis clique d'un boutton recherche ou bien recherche instantanée à chaque saisie de caractères. J'ai choisis la première approche pour plusieurs raisons parmi lesquelles en cliquant sur un bouton une certaine latence (liée à une combinaison complexe ou un lenteur réseau exceptionel) peut être plus facilement acceptée. Aussi, cela permet d'avoir deux états distinctes et simplifier l'implémentation et sa maintenabilité.

## Présentation

Les options étaient : tableau ou liste de cartes, pagination ou scroll infini (ou 'show more').

J'ai choisis les cartes car elles permettent de faire un affichage responsive. Et j'ai choisis le scroll infini car la pagination se présente aussi comment un espace de configuration que l'on confond avec "l'espace de configuration" des filtres.


# Composants et modèles

Il y a 4 composants:
- **Content**: Il est composé des deux grilles : la grille pour les champs de recherches et la grille des cards.
- **FilmLocation**: C'est la card d'un film.
- **Header**: Barre d'entête qui n'affiche que le titre de l'application.
- **QueryInput**: C'est un champ de recherche. Ce composant est réutilisé pour les 3 champs de recherches.

Il y a 3 modèles:
- **FilmLocation**: Contient toute les propriétés d'un film ou lieu de tournage.
- **Option**: Contient les valeurs de filtres sélectionnées pour les 3 champs type, ardt et année.
- **ResultSet**: Contient la liste des films, l'offset et le total.


# Principe de fonctionnement

## Premier chargement

Le premier chargement de la page fait un appel de l'API et créer le premier ResultSet.

## Scroll

Lorsque l'utilisateur scrolle jusqu'à arriver au bas de la liste, on compare l'offset et le total stocké dans le ResultSet. S'il est inférieur alors on demande un fetch en précisant l'offset courant. Au passage, les options étant stockés dans le contexte, elles sont aussi envoyés à l'API pour filtre. Cela permet de supporter le scrolle infini aussi avec des filtres sans effort.

## Sélection d'options

Lorsque l'utilisateur sélectionne une option, celle-ci est transmise au composant parent par double binding (voir la fonction ```bindingHandler```).
Lorsque l'utilisateur clique sur **Search** un appel à l'API est fait avec offset à 0. Les options sont systématiquement passé à l'API. 

Au retour de l'API le contexte est mis à jours : création d'un nouveau ResultSet composé des anciennes données et des nouvelles données.

# Etapes de développement

1. Génération d'une application React avec le scalfold officiel et typescript en paramètre d'option
2. Création d'un layout avec un header (composant 'Header') et une zone de contenu (composant 'Content')
3. Création de deux zones dans le composant Content avec un espace pour la recherche et un espace pour l'affichage des résultats
4. Création d'une grille en utilisant Grid de React material. Et création de Card à l'intérieur de cette la grille. Puis configuration de la Grid pour supporter 4 résolutions. L'objectif était de permettre d'empiler les card en fonction des résolutions. J'ai testé le fonctionnement en réduisant manuellement la taille du navigateur.
5. Appel de l'API uniquement à l'intérieur du code avec des paramètres en dure. Modification du rendu des cards pour afficher les données réelles de l'API.
6. Création d'un component spécifique pour les cards. Et implémentation de l'appel à l'API. Gestion des state et fonctions useEffect pour avoir un chargement initial 'propre'.
7. Création d'une grille pour les filtres de la zone de recherche (composant query.input). Gestion des résolutions pour afficher les 3 champs et le champ recherche en fonction de la résolution.
8. Création des champs input et gestion de la sélection des filtres.
9. Gestion du binding entre les filtres et le composant parent qui possède le boutton Search
10. Modification du composant API pour supporter le filtrage
11. Gestion du scroll infini sur le front et adaptation de l'API pour le passage de l'offset.
12. Tests et bug fixes.

## Pistes d'améliorations

- Implémentations de tests unitaires
- Séparations des deux grilles dans deux composants
- Mise en cache des résultats de recherche (besoin à démontrer)
- Remplacer le test sur "Année" codé en dure, grâce à l'utilisation d'une propriété type de données (date ou text)

