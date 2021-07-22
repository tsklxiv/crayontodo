import * as prompt from "cliffy-prompt";
import * as ink from "ink";

class Todo {
		tag: string;
		done: boolean;
		content: string;

		constructor(tag: string, content: string) {
				this.done = false;
				this.tag = tag;
				this.content = content;
		}

		mark() {
				this.done = !this.done;
		}
}

const VERSION = "0.1";
const HELP = `
CrayonTodo ${VERSION}

A simple CLI todo list app. Written in TypeScript.

Mark:
  Done? -> Not Done
  Done! -> Done

Commands:
  mark <n>   -> Mark the todo at index n
  remove <n> -> Delete the todo at index n
  add        -> Add a todo
  version    -> Version of this app
  help       -> Print this message
  exit       -> Exit this program
`;
var todos: Array<Todo> = [];
var tags: Map<string, string> = new Map<string, string>();
var error = (msg: string) => ink.colorize(`<red>${msg}</red>`);
var success = (msg: string) => ink.colorize(`<green>${msg}</green>`);
var greeting = (msg: string) => ink.colorize(`<blue>${msg}</blue>`);

var can_be_accessed = (list: Array<any>, idx: number) => {
		let content = list[Number(idx)];

		if (content == undefined) {
				return false;
		}
		return true;
}

var ask_for_color = async (input_msg: string) => {
		console.log(success(input_msg), "[Type '?' for color options]");
		const color_options = ["red", "green", "blue", "yellow", "magenta", "cyan"];
		
		while (true) {
				const color = await prompt.Input.prompt("");

				if (color == "?") {
						console.log("List of colors:")
						for (let i = 0; i < color_options.length; i++) {
								let the_color = color_options[i];

								console.log(ink.colorize(`<${the_color}>${the_color}</${the_color}>`));
						}
				} else if (!color) {
						console.log(error("Invalid color!"));
				} else {
						return color;
				}
		}
}

var add_todo = (tag: string, content: string) => todos.push(new Todo(tag, content));
var add_todo_content = async () => {	
		const content = await prompt.Input.prompt("Content [empty if you aren't intended to add a todo]");
		if (!content) {
				return;
		}
		var tag_color: any;
		const tag = await prompt.Input.prompt("Tag");
		if (!tags.has(tag)) {
				tag_color = await ask_for_color("Tag color");
		} else {
				tag_color = tags.get(tag);
		}

		if (content == undefined) {
				console.error(error("Invalid content!"));
		} else if (tag == undefined || !tag) {
				console.error(error("Invalid tag!"));
		} else {
				tags.set(tag, tag_color);
				add_todo(tag, content);
		}
};
var remove_todo = (index: number) => {
		if (!can_be_accessed(todos, index)) {
				console.error(error(`The index is not valid or todo at that index does not exist.`));
		} else {
				todos.splice(todos.indexOf(todos[index]), 1);
		}
};
var mark_todo = (index: number) => {
		if (!can_be_accessed(todos, index)) {
				console.error(error(`The index is not valid or todo at that index does not exist.`));
		} else {
				todos[index].mark();
		}
};
var show_todo = () => {
		for (let i = 0; i < todos.length; i++) {
				let todo = todos[i];
				console.log(
						ink.colorize(`<${tags.get(todo.tag)}>${todo.tag}</${tags.get(todo.tag)}>: ${todo.content}: ${!todo.done ? error("Done?") : success("Done!")}`)
				);
		}
}

var repl = async () => {
		console.log(greeting(`Welcome to CrayonTodo version ${VERSION}!`));
		console.log("Type 'help' for help. And Ctrl-C (or 'exit') to quit.");

		while (true) {
				show_todo();
				const input = (await prompt.Input.prompt("")).split(" ");

				switch (input[0]) {
						case "": break;
						case "add":	await add_todo_content(); break;
						case "remove": remove_todo(Number(input[1])); break;
						case "mark": mark_todo(Number(input[1])); break;
						case "help": console.log(success(HELP)); break;
						case "version": console.log(`Version: ${greeting(VERSION)}`); break;
						case "exit": Deno.exit(0); break;	
						default: console.error(error(`Invalid command: ${input[0]}`));
				}
		}
}

repl();
