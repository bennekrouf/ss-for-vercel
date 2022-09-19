import FilmLocation from './FilmLocation';
type ResultSet = {
    filmLocations: FilmLocation[],
    totalCount: number,
    offset: number
}

export default ResultSet;