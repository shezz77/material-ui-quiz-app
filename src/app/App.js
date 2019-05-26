import React from "react";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Answer from "./components/Answer/Answer";
import QuestionParagraph from "./components/Question/Question.js";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";

import logo from "../assets/logo.svg";
import theme from "./styles/theme";
import styles from "./styles/style";
import questionsFactoryService from "./models/factories/get-questions-service";
import CircularLoading from "./components/CircularLoading";

import { CSSTransitionGroup } from "react-transition-group";

class App extends React.Component {
    lastTimeButtonClicked = new Date().getTime();

    state = {
        questions: null,
        clientAnswerIndexes: [],
        currentQuestionIndex: 0
    };

    componentDidUpdate(prevProps, prevState) {
        this.updateButtonsPos();

        setTimeout(() => {
            this.updateButtonsPos();
        }, 0);

        // setTimeout(() => {
        // }, 500);
    }

    componentDidMount() {
        window.onorientationchange = () => this.updateButtonsPos();
        window.onresize = () => this.updateButtonsPos();

        questionsFactoryService(false).then(value => {
            this.setState({ questions: value }, () => {
                this.updateButtonsPos();
            });
        });

        this.updateButtonsPos();

        setTimeout(() => {
            this.updateButtonsPos();
        }, 0);
    }

    onNextClick = e => {
        const currentState = this.state;

        if (currentState.currentQuestionIndex === currentState.questions.length - 1 || this.areButtonsAnimating()) {
            return;
        }

        console.log(currentState.currentQuestionIndex);
        this.updatePage(++currentState.currentQuestionIndex);
    };

    onPrevClick = e => {
        const currentState = this.state;

        if (currentState.currentQuestionIndex === 0 || this.areButtonsAnimating()) {
            return;
        }

        this.updatePage(--currentState.currentQuestionIndex);
    };

    onSubmitClick = e => {
        console.log("submit");
    };

    onAnswerSelected = e => {
        let clickedAnswerIndex = +e.target.id;
        let currentState = this.state;
        const currentAnswers = this.state.clientAnswerIndexes;
        currentAnswers[currentState.currentQuestionIndex] = clickedAnswerIndex;

        this.setState({
            userAnswerIndexes: currentAnswers,
        })
    }

    updateButtonsPos = () => {
        if (!this.questionsLoaded()) {
            return false;
        }

        let buttons = Array.from(document.getElementById("buttonsContainer").children);
        let mainContainer = document.getElementById("mainContainer");

        buttons.forEach(button => {
            button.style.bottom = "0px";
        });

        const bottomPosition = mainContainer.clientHeight - mainContainer.scrollHeight + 20;

        buttons.forEach(button => {
            button.style.bottom = bottomPosition + "px";
        });
    };

    updatePage = questionIndex => {
        this.lastTimeButtonClicked = new Date().getTime();
        document.getElementById("mainContainer").scrollTop = 0;
        this.setState({
            currentQuestionIndex: questionIndex
        });
    };
    questionsLoaded = () => (this.state.questions !== null ? true : false);
    getCurrentQuestion = () => this.state.questions[this.state.currentQuestionIndex].question;
    getCurrentAnswers = () => this.state.questions[this.state.currentQuestionIndex].answer;
    isAnswerSelected = answerIndex => this.state.clientAnswerIndexes[this.state.currentQuestionIndex] === answerIndex;
    shouldShowSubmit = () => this.state.currentQuestionIndex === this.state.questions.length - 1 && this.state.clientAnswerIndexes[this.state.questions.length - 1] !== undefined;;
    shouldShowNext = () =>
        this.state.currentQuestionIndex !== this.state.questions.length - 1 &&
        this.state.clientAnswerIndexes[this.state.currentQuestionIndex] !== undefined;
    shouldShowPrev = () => this.state.currentQuestionIndex !== 0;

    areButtonsAnimating = () => {
        const transitionTime = 600;
        const currentTime = new Date().getTime();

        return currentTime - transitionTime <= this.lastTimeButtonClicked;
    };

    addCssTransition = elem => {
        return (
            <CSSTransitionGroup
                transitionName="mainApp"
                transitionAppear={true}
                transitionEnterTimeout={500}
                transitionAppearTimeout={500}
                transitionLeave={false}
                transitionLeaveTimeout={500}
            >
                {elem}
            </CSSTransitionGroup>
        );
    };

    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                {this.addCssTransition(
                    <Paper id="mainContainer" className={classes.paper} elevation={2}>
                        <img key={"logo"} src={logo} className={classes.logo} alt="logo" />
                        <hr key={"horizontalLine"} width={"100%"} />
                        {this.questionsLoaded() ? (
                            <div>
                                {this.addCssTransition(
                                    <div key={this.getCurrentQuestion()}>
                                        <QuestionParagraph
                                            key={this.getCurrentQuestion()}
                                            question={this.getCurrentQuestion()}
                                            questionIndex={this.state.currentQuestionIndex + 1}
                                            questionsLength={this.state.questions.length}
                                        />

                                        <div className={classes.answerContainer}>
                                            {this.getCurrentAnswers().map((currentAnswer, index) => (
                                                <Answer
                                                    answerIndex = {index}
                                                    key={this.getCurrentQuestion() + index}
                                                    answer={currentAnswer}
                                                    isSelected={this.isAnswerSelected(index)}
                                                    onAnswerSelect={this.onAnswerSelected}
                                                />
                                            ))}
                                        </div>

                                        <div id="buttonsContainer">
                                            {this.shouldShowSubmit() ? (
                                                <Button
                                                    variant="contained"
                                                    className={classes.btnSubmit}
                                                    onClick={this.onSubmitClick}
                                                    color="primary"
                                                >
                                                    Submit
                                                </Button>
                                            ) : null}

                                            {this.shouldShowNext() ? (
                                                <Button
                                                    variant="contained"
                                                    className={classes.btnNext}
                                                    onClick={this.onNextClick}
                                                    color="primary"
                                                >
                                                    Next
                                                </Button>
                                            ) : null}

                                            {this.shouldShowPrev() ? (
                                                <Button
                                                    variant="contained"
                                                    className={
                                                        this.shouldShowSubmit()
                                                            ? classes.btnPrevSubmit
                                                            : classes.btnPrev
                                                    }
                                                    onClick={this.onPrevClick}
                                                    color="primary"
                                                >
                                                    Prev
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <CircularLoading key={"loadingCircle"} />
                        )}
                    </Paper>
                )}
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(App);
