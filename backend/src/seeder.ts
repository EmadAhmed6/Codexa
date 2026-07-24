import { Post } from "./modules/posts/post.model.js";
import posts  from './data.js';
import connectToDB  from "./config/db.js";
import dotenv  from "dotenv";
dotenv.config();

const importPosts = async () => {
    try {
        await connectToDB();
        await Post.insertMany(posts);
        console.log('Posts imported successfully');
        process.exit();
    } catch(err) {
        console.error('Error importing posts', err);
        process.exit(1);
    }
}

const destroyPosts = async () => {
    try {
        await connectToDB();
        await Post.deleteMany();
        console.log('Posts destroyed successfully');
        process.exit();
    } catch(err) {
        console.error('Error destroying posts', err);
        process.exit(1);
    }
}

if (process.argv[2] === '-import') {
    importPosts();  
} else if (process.argv[2] === '-destroy') {
    destroyPosts();
}
