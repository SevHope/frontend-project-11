import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submit: document.querySelector("button[type = 'submit']"),
  };

  const initialState = {
    form: {
      valid: true,
      errors: [],
      feeds: [],
      link: '',
    },
  };

  const schema = yup
    .string()
    .required()
    .url();

  const validateLink = (link, state) => schema.validate(link)
    .then(() => {
      if (state.form.feeds.includes(link)) {
        throw new Error('Link must be unique');
      }
      state.form.feeds.push(link);
      console.log('нет ошибки');
      return {};
    })
    .catch((e) => {
      console.log('есть ошибка');
      return { link: e.message };
    });

  const state = onChange(initialState, () => render(elements, state));

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = elements.input;
    state.form.link = value;
    const errors = await validateLink(state.form.link, state);
    state.form.errors = errors;
  });
};