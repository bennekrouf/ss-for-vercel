import { useEffect, useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import LinearProgress from "@mui/material/LinearProgress";
import InfiniteScroll from 'react-infinite-scroll-component';

import { load as apiLoad } from '../api/film.locations';
import criterias from "../data/criterias";
import ResultSet from '../models/ResultSet';
import Option from '../models/Option';

import QueryInput from './QueryInput';
import FilmLocationRow from './FilmLocation';
import styles from '../app.module.css';

const initialResultSet: ResultSet = {
    filmLocations: [],
    totalCount: 0,
    offset: 0
};

const Result = () => {
    const [resultSet, setResultSet] = useState<ResultSet>(initialResultSet);
    const [hasMoreValue, setHasMoreValue] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [option, setOption] = useState<Option>({});
    const [isError, setIsError] = useState(false);

    const isEmptyOption = useCallback(() => 
        !option 
        || (Object.keys(option).reduce((acc, val) => acc += option[val].length, 0) === 0), [option]);

    const handleOnRowsScrollEnd = () => {
        if (resultSet.offset < resultSet.totalCount) {
            setHasMoreValue(true);
            loadData(resultSet.offset);
        } else {
            setHasMoreValue(false);
        }
    }

    const loadData = useCallback(async (offset:number) => {
        setIsLoading(true);
        setIsError(false);
        if (offset === 0) { // Primary load or remove all options
            setResultSet((prev:ResultSet) => ({ filmLocations: [], totalCount: 0, offset: 0 })); 
        }
        return apiLoad(offset, option).then((res:ResultSet) => {
            setResultSet(prevResultSet => {
                return {
                    filmLocations: [...prevResultSet.filmLocations, ...res.filmLocations],
                    totalCount: res.totalCount,
                    offset: res.offset
                }
            });
            return resultSet;

        }).catch((err:any) => {
            console.log(err);
            setIsError(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [option]);

    const fetchWithOptions = useCallback(() => {
        if (!isEmptyOption()) {
            setResultSet({ ...initialResultSet });
            loadData(0);
        }
    }, [isEmptyOption, loadData]);

    useEffect(() => {
        loadData(0);
    }, [loadData]);

    const bindingHandler = (updatedOption: Option) => {
        option[Object.keys(updatedOption)[0]] = updatedOption[Object.keys(updatedOption)[0]];
        setOption(option);
    }
    
    return (
        <main className={styles.main_section}>
            <div className={styles.container}>
                <div className={styles.search_section}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 3, md: 0 }}>
                            {
                                criterias.map((e, i) => (
                                    <Grid xs={12} sm={12} md={6} lg={4} xl={3}  key={i}>
                                        <QueryInput updateOption={bindingHandler} {...e}  />
                                    </Grid>
                                ))
                            }
                            <Grid xs={12} sm={6} md={6} lg={3} xl={4}>
                                <Button onClick = { fetchWithOptions } variant="contained" style={{minWidth: '240px', backgroundColor:'#147b7b'}}>Search</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <Box sx={{ flexGrow: 1 }}>
                    {
                        !isLoading && !isError && !resultSet.filmLocations?.length 
                        && (<Alert variant="outlined" severity="info">
                            The selected criteria do not return any results. Please change your options.</Alert>)
                    }
                    {
                        !isLoading && isError 
                        && (<Alert variant="outlined" severity="error">
                            An error occured — please try something different 🙏 </Alert>)
                    }
                    {  resultSet.filmLocations?.length > 0 && (
                            <InfiniteScroll
                            dataLength={resultSet.filmLocations?.length}
                            next={handleOnRowsScrollEnd}
                            hasMore={hasMoreValue}
                            scrollThreshold={1}
                            loader={<LinearProgress />}
                            style={{ overflow: "unset" }}>
                                <Grid container spacing={{ xs: 2, md: 5 }} >
                                    { 
                                        resultSet.filmLocations.map(fl => (
                                            <Grid xs={12} sm={12} md={6} lg={4} xl={3} key={fl.id}>
                                                <FilmLocationRow {...fl} />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </InfiniteScroll>
                    )}
                    {  isLoading && (<LinearProgress />) }
                </Box>
            </div>
        </main>
        )
}

export default Result;