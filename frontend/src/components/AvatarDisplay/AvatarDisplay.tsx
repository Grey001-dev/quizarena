import { generateAvatarSVG } from "../../utils/avatar";

interface AvatarDisplayProps{
    seed:string;
    size?:number;
}

export default function AvatarDisplay({seed,size=48}:AvatarDisplayProps){
    const svg =generateAvatarSVG(seed);
    return(
        <div
        style={{width:size,height:size,borderRadius:'50%',overflow:'hidden'}}
        dangerouslySetInnerHTML={{__html:svg}}
        >
        </div>
    )
}