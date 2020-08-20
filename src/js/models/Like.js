export default class Like {
    constructor() {
        this.likes = [];
    }
    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);
    }
    deleteLike(id) {
       this.likes.splice(this.likes.findIndex(el => el.id === id),1);
    }
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes() {
        return this.likes.length;
    }
}