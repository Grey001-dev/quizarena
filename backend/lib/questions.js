function shuffle(array){
    return [...array].sort(()=>Math.random()-0.5)
}

async function fetchFromTriviaAPI(category,difficulty,amount){
    let url=`https://the-trivia-api.com/v2/questions?limit=${amount}`
    if(category){
        url +=`&categories=${category}`
    }
    if(difficulty){ 
        url+=`&difficulties=${difficulty}`
    }
    const res=await fetch(url);
    if(!res.ok){
        throw new Error("Failed to fetch questions from Trivia API");
    }
    return res.json()
}

export async function fetchQuestions(category,difficulty,amount){
    let rawQuestions=[];
    console.log(category,amount,difficulty)
    if(!category || category.length==0){
        rawQuestions=await fetchFromTriviaAPI(null,difficulty,amount);
    }else{
        const perCategory=Math.floor(amount/category.length);
        let remainder=amount % category.length;
            for (let i=0;i<category.length;i++){
                if(i==0){
                    const results=await fetchFromTriviaAPI(category[i],difficulty,perCategory + remainder)
                    rawQuestions.push(...results);
                }else{
                    const results=await fetchFromTriviaAPI(category[i],difficulty,perCategory)
                    rawQuestions.push(...results)
                }
        }
        rawQuestions=shuffle(rawQuestions);
    }
    
     return rawQuestions.map((q,index)=>({
        id:q.id || `q${index}`,
        text: q.question.text,
        category:q.category,
        difficulty:q.difficulty,
        correctAnswer:q.correctAnswer,
        options:shuffle([q.correctAnswer,...q.incorrectAnswers]),
    }))
}