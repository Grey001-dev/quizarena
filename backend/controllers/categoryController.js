export async function getCategories(req,res){
    try {
        const response=await fetch("https://the-trivia-api.com/v2/categories");
        const data=await response.json();
        
        const categoryList=Object.keys(data).map((key)=>({
            id:key,
            name:key.replace(/_/g," "),
        }));
        return res.status(200).json(categoryList)
    } catch (error) {
        console.error("Error inside getCategories:",error);
        return res.status(500).json({message:"Failed to fetch categories"})
        
    }
}