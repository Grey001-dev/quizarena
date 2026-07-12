import {Style,Avatar} from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with {type:'json'};

const style=new Style(lorelei);

export function generateAvatarSVG(seed:string):string{
    const avatar=new Avatar(style,{seed});
    return avatar.toString();
}