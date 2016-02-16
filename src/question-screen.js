
'use strict';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
    Platform,
} from 'react-native';

import GridView from 'react-native-grid-view';
import SimpleStore from 'react-native-simple-store';

import AnswerScreen from './answer-screen';

var TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
}

const questions = {
    '06f9bff5-c51e-4087-ab88-2497bb7516c3': {
        uuid: '06f9bff5-c51e-4087-ab88-2497bb7516c3',
        text: '.@FLOTUS @funnyordie @billyeichner: I actually own three tuxedos!',
        options: [
            {
                name: 'Big Bird',
                handle: 'BigBird',
                image: require('../assets/bigbird.png'),
                chosenText: 'lol, yea...',
                isAuthor: true,
            },
            {
                name: 'Jason Calacanis',
                handle: 'Jason',
                image: require('../assets/jason.jpg'),
                chosenText: '',
            },
            {
                name: 'John Lilly',
                handle: 'johnolilly',
                image: require('../assets/johnolilly.jpeg'),
            },
            {
                name: 'Benedict Evans',
                handle: 'BenedictEvans',
                image: require('../assets/benedictevans.jpeg'),
            }
        ]
    },
    '06f9bff5-c51e-4087-ab88-djdjdjdjdj': {
        uuid: '06f9bff5-c51e-4087-ab88-djdjdjdjdj',
        text: 'monkies',
        options: [
            {
                name: 'Benedict Evans',
                handle: 'BenedictEvans',
                image: require('../assets/benedictevans.jpeg'),
            },
            {
                name: 'Jason Calacanis',
                handle: 'Jason',
                image: require('../assets/jason.jpg'),
            },
            {
                name: 'Big Bird',
                handle: 'BigBird',
                image: require('../assets/bigbird.png'),
                isAuthor: true,
            },
            {
                name: 'John Lilly',
                handle: 'johnolilly',
                image: require('../assets/johnolilly.jpeg'),
            },
        ]
    }
};

SimpleStore.save('questions', questions);



class QuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { question: null };
    }

    componentWillMount() {
        SimpleStore.get('questions').then((questions) => {
            for (var id in questions) {
                var question = questions[id];

                if (!question.answered) {
                    this.setState({ question: question });
                    break;
                }
            }
        });
    }

    render() {
        if (!this.state.question) {
            return (
                <View>
                </View>
            );
        }

        return (
            <View style={styles.gameScreen}>
                <Question question={this.state.question} />
                <Answers
                    question={this.state.question}
                    navigator={this.props.navigator}
                    selectCallback={this.onSelectedAnswer.bind(this)}/>
            </View>
        )
    }

    onSelectedAnswer(selectedOption) {
        var questionUpdate = {};
        questionUpdate[this.state.question.uuid] = Object.assign({}, this.state.question, { answered: true });

        SimpleStore.update('questions', questionUpdate).then(() => {
            this.props.navigator.push({
                name: 'AnswerScreen',
                component: (props) => {
                    return new AnswerScreen(props, this.state.question, selectedOption);
                }
            });
        });
    }
}

class Question extends Component {
    render() {
        return (
            <View style={styles.questionBox}>
                <View>
                    <Image
                        style={styles.profilePic}
                        source={require('../assets/egg-profile.jpeg')}
                    />
                </View>

                <View style={styles.questionContent}>
                    <Text style={styles.headText}>
                        ???
                    </Text>
                    <Text style={styles.bodyText}>
                        {this.props.question.text}
                    </Text>
                </View>
            </View>
        )
    }
}

class Answers extends Component {
    render() {
        return (
            <View style={styles.answerBox}>

                <GridView
                    items={this.props.question.options}
                    itemsPerRow={2}
                    renderItem={this.renderOption.bind(this)}
                />

            </View>
        )
    }

    renderOption(option) {
        return (
            <Option
                option={option}
                question={this.props.question}
                navigator={this.props.navigator}
                selectCallback={this.props.selectCallback}
                key={option.handle}
            />
        );
    }
}

class Option extends Component {
    render() {
        return (
            <TouchableElement onPress={() => this.props.selectCallback(this.props.option)}>
                <View style={styles.answerOption}>
                        <Image
                            style={styles.profilePic}
                            source={this.props.option.image}
                        />
                    <View style={styles.optionContent}>
                        <Text style={styles.optionName}>
                            {this.props.option.name}
                        </Text>
                        <Text style={styles.optionHandle}>
                            @{this.props.option.handle}
                        </Text>
                    </View>
                </View>
            </TouchableElement>
        );
    }
}

const styles = StyleSheet.create({
    gameScreen: {
        flex: 1,
    },
    questionBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    questionContent: {
        flex: 1,
        padding: 8,
        flexDirection: 'column',
    },
    answerBox: {
        flex: 2,
        // backgroundColor:'#ebeef0',
        flexDirection: 'column',
    },
    answerRow: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    answerOption: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    optionContent: {
        padding: 8,
        flexDirection: 'column',
        alignItems: 'center',
    },
    headText: {
        fontSize: 20,
        textAlign: 'left',
        margin: 10,
    },
    bodyText: {
        fontSize: 16,
        textAlign: 'left',
    },
    optionName: {
        fontSize: 16,
        textAlign: 'center',
    },
    optionHandle: {
        fontSize: 12,
        textAlign: 'center',
    },
    profilePic: {
        width: 64,
        height: 64,
    },
});

export default QuestionScreen;
