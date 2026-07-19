import prisma from "../lib/prisma.ts";


function formatCategoryDisplay(categoryString) {
  if (!categoryString) return "Mixed";

  const categories = categoryString.split(",").filter(Boolean);

  if (categories.length === 0 || categories.length > 1) return "Mixed";

  return categories[0].replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export const getLeaderboard=async(req,res)=>{
    try {
        const topUsers=await prisma.user.findMany({
            orderBy:{elo:'desc'},
            take:20,
            select:{
                id:true,
                username:true,
                elo:true,
                avatarSeed:true,
            }
        });
        return res.status(200).json(topUsers)
    } catch (error) {
        console.error("Failed to fetch leaderboard:" ,error);
        return res.status(500).json({message:"Failed to fetch leaderboard"}) 
    }
}



export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Since my rooom is a foreign key
    const sessions = await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { joinedAt: 'desc' },
      include: {
        room: {
          select: { category: true, difficulty: true, solo: true, createdAt: true }
        }
      }
    });
    // Used this in calculating for the stats of the users from my session database
    const gamesPlayed = sessions.length;
    const wins = sessions.filter(s => s.eloChange > 0).length;
    const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
    const bestRank = sessions.length > 0
      ? Math.min(...sessions.map(s => s.rank || 999))
      : null;
// Brooooooooooooooo stressssssss right here😭😭😭😭....formatting this category and the difficulty was exhausting
    const recentGames = sessions.slice(0, 5).map(s => ({
      category: formatCategoryDisplay(s.room.category),
      difficulty: s.room.difficulty ? s.room.difficulty.charAt(0).toUpperCase() + s.room.difficulty.slice(1) : "Mixed" ,
      solo: s.room.solo,
      score: s.score,
      eloChange: s.eloChange,
      rank: s.rank,
      playedAt: s.room.createdAt,
    }));

    return res.status(200).json({
      gamesPlayed,
      winRate,
      bestRank,
      recentGames,
    });

  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
};