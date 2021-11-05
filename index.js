//require express and path modules
const express = require("express");
const app = express();
const path = require("path"); //path is a built-in express module
const { v4: uuid } = require("uuid"); //creates new unique id when uuid is called

//allows for static files like css and js to be served from 'public' folder; requires 'public' dir
app.use(express.static(path.join(__dirname, "public")));

//for parsing applications in the urlencoded form; to use with req.body for post requests
app.use(
	express.urlencoded({
		extended: true,
	})
);

//sets view engine to ejs and allows for server to be ran outside of cwd; ejs files req 'views' dir
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Pretend Database: Resource is gonna be comments from a social media app
const comments = [
	{
		id: uuid(),
		username: "Tim",
		comment: "Hello i am tim",
	},
	{
		id: uuid(),
		username: "bigjoe",
		comment: "i am weird but i dont know it",
	},
	{
		id: uuid(),
		username: "red",
		comment: "give me some of that",
	},
	{
		id: uuid(),
		username: "allstarali",
		comment: "i got stuck with rocks",
	},
];

//ROUTING PAGES WITH COMMENTS AS A RESOURCE

app.get("/", (req, res) => {
	res.render("home");
});

//INDEX ROUTE: this route displays all comments
app.get("/comments", (req, res) => {
	res.render("comments/index", {
		comments,
	});
});

//NEW ROUTE: this renders a form for user to create a comment
app.get("/comments/new", (req, res) => {
	res.render("comments/new");
});

//CREATE ROUTE: posts new comments to the server side
app.post("/comments", (req, res) => {
	const { username, comment } = req.body;

	comments.push({
		username,
		comment,
		id: uuid(),
	}); //appends the new comment to the pretend database

	res.redirect("/comments"); //redirects user to the INDEX route by making a default get request for that '/comments' url
});

//SHOW ROUTE: Gives details for one specific route
app.get("/comments/:id", (req, res) => {
	const { id } = req.params;
	const comment = comments.find((c) => c.id === id);
	console.log(comment);
	res.render("comments/show", {
		comment,
	});
});

//EDIT ROUTE: edits a specific comment
app.patch("/comments/:id", (req, res) => {
	const { id } = req.params;
	const newCommentText = req.body.comment; //patch req also has a payload you can access via req.body
	const foundComment = comments.find((c) => c.id === id);
	foundComment.comment = newCommentText;
	res.redirect("/comments");
});

//RUNNING SERVER
app.listen("3000", () => {
	console.log("Server is running on port 3000");
});
