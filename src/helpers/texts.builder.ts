import criterias from "../data/criterias";

const orURI = () => ' OR '

const otherTextURI = (texts: string[], optionTitle:string) => {
    const criteria = criterias.filter((c:any) => c.title === optionTitle)[0].field;
    let result = `${criteria}='${texts[0]}'`;
     for(let i = 1; i < texts.length; i++){
        result += `${orURI()}${criteria}=${texts[i]}`;
    }
    return texts.length > 1 ? `(${result})` : result; // Add () to have the prevalence of OR operator over AND one
}

export default otherTextURI;