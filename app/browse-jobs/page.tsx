import React from 'react';

const BrowsingJobsPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search=await searchParams
   
    const urlSearch=new URLSearchParams(search as Record<string,string> )
    const query=urlSearch.toString()
     console.log(query);
    return (
        <div>
            browing 
        </div>
    );
};

export default BrowsingJobsPage;