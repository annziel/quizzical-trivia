type Question = {
    category: string,
    type: string,
    difficulty: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[],
	shuffled_answers: string[],
	selected_answer: string,
	id: number,
}

async function getNewQuestions() {
	const apiData = await getApi();
	const questionsWithoutEncoding = getDataWithoutEncoding(apiData.results);
	const questionsToRender = prepareToRender(questionsWithoutEncoding);
	return questionsToRender
}

function getDataWithoutEncoding(data) {
	return data.map(obj => {
		const newObj = {
			...obj,
			question: escapeEncoding(obj.question),
			incorrect_answers: obj.incorrect_answers.map(answer => escapeEncoding(answer)),
			correct_answer: escapeEncoding(obj.correct_answer),
		};
		return newObj;
	});
}

function escapeEncoding(text) {
	return new DOMParser().parseFromString(text, 'text/html').body.textContent;
}

async function getApi() {
	const res = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
	const apiData = await res.json();
	return apiData;
}

function prepareToRender(array: Question[]) {
	return array.map((obj, index) => {
		const newObj = {
			...obj,
			// making the array of possible answers and shuffle it for a random order
			shuffled_answers: getShuffledAnswers([...obj.incorrect_answers, obj.correct_answer]),
			// for answer checking
			selected_answer: "",
			// for key and id properties
			id: index + 1,
		};
		return newObj;
	});
}

// randomize array in-place using Durstenfeld shuffle algorithm
function getShuffledAnswers(array: string[]) {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const rand = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[rand]] = [newArray[rand], newArray[i]];
	}
	return newArray;
}


export { getNewQuestions, Question }