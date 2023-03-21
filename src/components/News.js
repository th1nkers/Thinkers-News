import React, {useEffect, useState} from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News =(props)=> {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState([true])
    const [totalResults, setTotalResults] = useState(0)
    const [page, setPage] = useState(1)
   

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews= async()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props?.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
      }

    useEffect(()=>{
        document.title = `${capitalizeFirstLetter(props.category)} - Thinker's News`;
        updateNews();
        // eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults)
    };
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>Latest News: {capitalizeFirstLetter(props.category)}</h1>
                {loading && <Spinner />}

                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />}>
                    <div className="container">
                        <div className="row">
                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <NewsItems title={element.title ? element.title : ""} description={element.description ? element.description : ""} author={element.author} date={element.publishedAt} imageUrl={element.urlToImage} source={element.source.name} newsUrl={element.url} /> </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
    }

    News.defaultProps = {
        country: 'in',
        pageSize: 6,
        category: 'general',
        totalResults: 0
      };

News.propTypes = {
    country: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired,
}

export default News
