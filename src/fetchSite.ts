export async function fetchSite(url: string){
    try{
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error fetching ${url}: ${response.statusText}`);
          }
          const html = await response.text();
          return html;
    }catch(error){
        console.error('Fetch error:', error);
    throw error;
    }
}