import FilmLocation from "../models/FilmLocation";
import ResultSet    from "../models/ResultSet";
import Option       from "../models/Option";

import anneeTournageURI from "../helpers/years.builder";
import otherTextURI     from "../helpers/texts.builder";

const limit = 30;
const andURI = ' AND '

const API_URL = 'https://opendata.paris.fr/api/v2/catalog/datasets/lieux-de-tournage-a-paris/records';
const get = async (index:number | 0, params: string | undefined) => {
    const metadata = `limit=${limit}&offset=${index}&timezone=UTC`;
    return await (await fetch(`${API_URL}?${params ? params + '&': ''}${metadata}`)).json();
}

const buildQueryAndGet = async (offset: number, aOption: Option) => {
    let queryParams: string[] = [];
    Object.keys(aOption).forEach((optionTitle:string) => {
        if (aOption[optionTitle] && aOption[optionTitle].length) {
            if(optionTitle === 'Année') {
                queryParams.push(anneeTournageURI(aOption[optionTitle]));
            } else {
                queryParams.push(otherTextURI(aOption[optionTitle], optionTitle));
            }
        }
    });
    return get(offset,  encodeURI('where=' + queryParams.join(`${andURI}`)));
}

const load = async (offset: number, aOption: Option | undefined): Promise<ResultSet> => {
    const promise = aOption ? buildQueryAndGet(offset, aOption) : get(offset, undefined);
    return promise.then((res:any) => {
        const newData: FilmLocation[] = res?.records?.map((element:any) => ({ 
            ...element.record.fields,
            id: element.record.id
        }));
        return {
            filmLocations: [...newData],
            totalCount: res?.total_count,
            offset: offset + newData.length
        };
    })
}

export {
    load
};