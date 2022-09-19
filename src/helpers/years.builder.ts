const orURI = () => ' OR '

const yearURI = (year:string) => {
    const theDate = `date'${year}/01/01'`;
    return `annee_tournage=${theDate}`;
}

const anneeTournageURI = (years: string[]) => {
    let result = yearURI(years[0]);
    for(let i = 1; i < years.length; i++){
        result += `${orURI()}${yearURI(years[i])}`;
    }
    return years.length > 1 ? `(${result})` : result; // Add () to have the prevalence of OR operator over AND one
}

export default anneeTournageURI;