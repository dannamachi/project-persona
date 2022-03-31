import { Howl } from 'howler'

const getPlayMusic = (musicName, isLoop=true) => {
    return new Howl({
        //autoplay: true,
        src: [musicName],
        loop: isLoop,
        volume: 0.5
    })
}

export { getPlayMusic };