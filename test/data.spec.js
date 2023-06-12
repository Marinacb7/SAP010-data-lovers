const { global } = require('core-js');
import { fetchData, filterItemsBySearchTerm, filterByDirector, calculatePercentage, filterCharactersByMovie, filterByGender, sortByTitleAZ, sortByTitleZA, sortByReleaseYearOld, sortByReleaseYearNew, sortByRottenTomatoesHigh, sortByRottenTomatoesLow } from '../src/data.js';

describe('fetchData', () => {
  let originalConsoleError;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should return the data obtained from the API', async () => {
    const mockData = { id: 1, nome: 'Exemplo' };
    const mockResponse = { json: jest.fn().mockResolvedValue(mockData) };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const data = await fetchData('https://api.example.com/data');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data');
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(data).toEqual(mockData);
  });

  it('should return an empty array on errors', async () => {
    const mockError = new Error('Erro na requisição');
    global.fetch = jest.fn().mockRejectedValue(mockError);

    const data = await fetchData('https://api.example.com/data');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data');
    expect(console.error.mock.calls[0][0]).toBe('Ocorreu um erro ao obter os dados dos filmes:');
    expect(console.error.mock.calls[0][1]).toBe(mockError);
    expect(data).toEqual([]);
  });
});

// import fetchMock from 'jest-fetch-mock';
// fetchMock.enableMocks();

// describe('data', () => {
//   beforeEach(() => {
//     fetchMock.resetMocks();
//   });

//   it('getMovies deve retornar uma lista de filmes', async () => {
//     expect.assertions(2);

//     const mockResponse = {
//       films: [
//         {
//           "id": "2baf70d1-42bb-4437-b551-e5fed5a87abe",
//           "title": "Castle in the Sky",
//           "description": "The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa's science to make himself ruler of the world.",
//           "director": "Hayao Miyazaki",
//           "producer": "Isao Takahata",
//           "poster": "https://static.wikia.nocookie.net/studio-ghibli/images/c/c1/Castle_in_the_Sky.jpg",
//           "release_date": "1986",
//           "rt_score": "95",
//           "people": [
//             {
//               "id": "fe93adf2-2f3a-4ec4-9f68-5422f1b87c01",
//               "name": "Pazu",
//               "img": "https://static.wikia.nocookie.net/studio-ghibli/images/8/8b/Pazu.jpg",
//               "gender": "Male",
//               "age": "13",
//               "eye_color": "Black",
//               "hair_color": "Brown",
//               "specie": "Human"
//             }
//           ]
//         },
//         {
//           "id": "58611129-2dbc-4a81-a72f-77ddfc1b1b49",
//           "title": "My Neighbor Totoro",
//           "description": "Two sisters move to the country with their father in order to be closer to their hospitalized mother, and discover the surrounding trees are inhabited by Totoros, magical spirits of the forest. When the youngest runs away from home, the older sister seeks help from the spirits to find her.",
//           "director": "Hayao Miyazaki",
//           "producer": "Hayao Miyazaki",
//           "poster": "https://static.wikia.nocookie.net/studio-ghibli/images/d/db/My_Neighbor_Totoro.jpg",
//           "release_date": "1988",
//           "rt_score": "93",
//           "people": [
//             {
//               "id": "986faac6-67e3-4fb8-a9ee-bad077c2e7fe",
//               "name": "Satsuki Kusakabe",
//               "img": "https://static.wikia.nocookie.net/studio-ghibli/images/f/f2/Satsuki_Kusakabe.jpg",
//               "gender": "Female",
//               "age": "11",
//               "eye_color": "Dark Brown/Black",
//               "hair_color": "Dark Brown",
//               "specie": "Human"
//             }
//           ]
//         }
//       ]
//     };

//     fetchMock.mockResponse(JSON.stringify(mockResponse));

//     const result = data;
//     expect(result).toEqual(expect.any(Array));
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('getMovies deve retornar um array vazio em caso de erro', async () => {
//     expect.assertions(1);

//     fetchMock.mockReject(new Error('Erro na requisição'));

//     const result = data;
//     expect(result).toEqual([]);
//   });

//   it('getDirectors deve retornar uma lista de diretores únicos', async () => {
//     expect.assertions(1);

//     const mockResponse = {
//       films: [
//         {
//           id: '2baf70d1-42bb-4437-b551-e5fed5a87abe',
//           title: 'Castle in the Sky',
//           director: 'Hayao Miyazaki'
//         },
//         {
//           id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
//           title: 'My Neighbor Totoro',
//           director: 'Hayao Miyazaki'
//         },
//         {
//           id: '8123e5c6-58e1-409d-8673-9e866d3f3018',
//           title: 'Spirited Away',
//           director: 'Hayao Miyazaki'
//         },
//         {
//           id: '38b5e828-008f-41a5-8b46-25ae8f3ae1c2',
//           title: 'Grave of the Fireflies',
//           director: 'Isao Takahata'
//         }
//       ],
//     };

//     fetchMock.mockResponse(JSON.stringify(mockResponse));

//     const result = data;
//     expect(result).toEqual(expect.any(Array));
//   });

//   it('getDirectors deve retornar um array vazio em caso de erro', async () => {
//     expect.assertions(1);

//     fetchMock.mockReject(new Error('Erro na requisição'));

//     const result = data;
//     expect(result).toEqual([]);
//   });
// });


describe('filterItemsBySearchTerm', () => {
  const movies = [
    { title: 'Movie 1' },
    { title: 'Movie 2' },
    { title: 'Another Movie' }
  ];

  it('should filter items based on the search term', () => {
    const searchTerm = 'movie';

    const filteredItems = filterItemsBySearchTerm(movies, searchTerm);

    expect(filteredItems).toEqual([
      { title: 'Movie 1' },
      { title: 'Movie 2' },
      { title: 'Another Movie' }
    ]);
  });

  it('should be case-insensitive', () => {
    const searchTerm = 'another';

    const filteredItems = filterItemsBySearchTerm(movies, searchTerm);

    expect(filteredItems).toEqual([
      { title: 'Another Movie' }
    ]);
  });

  it('should return an empty array if no matching items are found', () => {
    const searchTerm = 'nonexistent';

    const filteredItems = filterItemsBySearchTerm(movies, searchTerm);

    expect(filteredItems).toEqual([]);
  });
});

describe('filterByDirector', () => {
  const movies = [
    { title: 'Movie 1', director: 'Director 1' },
    { title: 'Movie 2', director: 'Director 2' },
    { title: 'Movie 3', director: 'Director 1' },
    { title: 'Movie 4', director: 'Director 3' }
  ];

  it('should return all movies if director is "all"', () => {
    const director = 'all';

    const filteredMovies = filterByDirector(movies, director);

    expect(filteredMovies).toEqual(movies);
  });

  it('should filter movies by director', () => {
    const director = 'Director 1';

    const filteredMovies = filterByDirector(movies, director);

    expect(filteredMovies).toEqual([
      { title: 'Movie 1', director: 'Director 1' },
      { title: 'Movie 3', director: 'Director 1' }
    ]);
  });

  it('should return an empty array if no movies match the director', () => {
    const director = 'Nonexistent Director';

    const filteredMovies = filterByDirector(movies, director);

    expect(filteredMovies).toEqual([]);
  });
});

describe('calculatePercentage', () => {
  const filteredMovies = [
    { title: 'Movie 1', director: 'Director 1' },
    { title: 'Movie 2', director: 'Director 1' },
    { title: 'Movie 3', director: 'Director 1' }
  ];
  const totalMoviesCount = 10;
  const selectedDirector = 'Director 1';

  it('should return an empty string if selected director is "all"', () => {
    const result = calculatePercentage(filteredMovies, totalMoviesCount, 'all');

    expect(result).toEqual('');
  });

  it('should calculate and return the percentage of movies for the selected director', () => {
    const result = calculatePercentage(filteredMovies, totalMoviesCount, selectedDirector);

    expect(result).toEqual('Os filmes desse diretor representam 30% do total dos filmes.');
  });
});

describe('filterCharactersByMovie', () => {
  const movies = [
    {
      title: 'Movie 1',
      people: [
        { name: 'Character 1' },
        { name: 'Character 2' }
      ]
    },
    {
      title: 'Movie 2',
      people: [
        { name: 'Character 3' },
        { name: 'Character 4' }
      ]
    }
  ];

  it('should return all characters if title is "all"', () => {
    const result = filterCharactersByMovie(movies, 'all');

    expect(result).toEqual([
      { name: 'Character 1' },
      { name: 'Character 2' },
      { name: 'Character 3' },
      { name: 'Character 4' }
    ]);
  });

  it('should return characters from the specified movie', () => {
    const result = filterCharactersByMovie(movies, 'Movie 1');

    expect(result).toEqual([
      { name: 'Character 1' },
      { name: 'Character 2' }
    ]);
  });

  it('should return an empty array if the movie is not found', () => {
    const result = filterCharactersByMovie(movies, 'Nonexistent Movie');

    expect(result).toEqual([]);
  });
});

describe('filterByGender', () => {
  const movies = [
    {
      title: 'Movie 1',
      people: [
        { name: 'Person 1', gender: 'Male' },
        { name: 'Person 2', gender: 'Female' }
      ]
    },
    {
      title: 'Movie 2',
      people: [
        { name: 'Person 3', gender: 'Female' },
        { name: 'Person 4', gender: 'Non-Binary' }
      ]
    }
  ];

  it('should return all people if selectedGender is "all"', () => {
    const result = filterByGender(movies, 'all');

    expect(result).toEqual([
      { name: 'Person 1', gender: 'Male' },
      { name: 'Person 2', gender: 'Female' },
      { name: 'Person 3', gender: 'Female' },
      { name: 'Person 4', gender: 'Non-Binary' }
    ]);
  });

  it('should return people with the selected gender (case-insensitive)', () => {
    const result = filterByGender(movies, 'female');

    expect(result).toEqual([
      { name: 'Person 2', gender: 'Female' },
      { name: 'Person 3', gender: 'Female' }
    ]);
  });

  it('should return an empty array if no people have the selected gender', () => {
    const result = filterByGender(movies, 'NA');

    expect(result).toEqual([]);
  });
});

describe('sortByTitleAZ', () => {
  const movies = [
    { title: 'Movie D' },
    { title: 'Movie A' },
    { title: 'Movie C' },
    { title: 'Movie B' }
  ];

  it('should sort movies in alphabetical order (A-Z) by title', () => {
    const result = sortByTitleAZ(movies);

    expect(result).toEqual([
      { title: 'Movie A' },
      { title: 'Movie B' },
      { title: 'Movie C' },
      { title: 'Movie D' }
    ]);
  });
});

describe('sortByTitleZA', () => {
  const movies = [
    { title: 'Movie D' },
    { title: 'Movie A' },
    { title: 'Movie C' },
    { title: 'Movie B' }
  ];

  it('should sort movies in reverse alphabetical order (Z-A) by title', () => {
    const result = sortByTitleZA(movies);

    expect(result).toEqual([
      { title: 'Movie D' },
      { title: 'Movie C' },
      { title: 'Movie B' },
      { title: 'Movie A' }
    ]);
  });
});

describe('sortByReleaseYearOld', () => {
  const movies = [
    { title: 'Movie A', release_date: 2000 },
    { title: 'Movie B', release_date: 1995 },
    { title: 'Movie C', release_date: 2010 },
    { title: 'Movie D', release_date: 1987 }
  ];

  it('should sort movies in ascending order (old to new) by release year', () => {
    const result = sortByReleaseYearOld(movies);

    expect(result).toEqual([
      { title: 'Movie D', release_date: 1987 },
      { title: 'Movie B', release_date: 1995 },
      { title: 'Movie A', release_date: 2000 },
      { title: 'Movie C', release_date: 2010 }
    ]);
  });
});

describe('sortByReleaseYearNew', () => {
  const movies = [
    { title: 'Movie A', release_date: 2000 },
    { title: 'Movie B', release_date: 1995 },
    { title: 'Movie C', release_date: 2010 },
    { title: 'Movie D', release_date: 1987 }
  ];

  it('should sort movies in descending order (new to old) by release year', () => {
    const result = sortByReleaseYearNew(movies);

    expect(result).toEqual([
      { title: 'Movie C', release_date: 2010 },
      { title: 'Movie A', release_date: 2000 },
      { title: 'Movie B', release_date: 1995 },
      { title: 'Movie D', release_date: 1987 }
    ]);
  });
});

describe('sortByRottenTomatoesHigh', () => {
  const movies = [
    { title: 'Movie A', rt_score: 95 },
    { title: 'Movie B', rt_score: 82 },
    { title: 'Movie C', rt_score: 88 },
    { title: 'Movie D', rt_score: 73 }
  ];

  it('should sort movies in descending order (high to low) by Rotten Tomatoes score', () => {
    const result = sortByRottenTomatoesHigh(movies);

    expect(result).toEqual([
      { title: 'Movie A', rt_score: 95 },
      { title: 'Movie C', rt_score: 88 },
      { title: 'Movie B', rt_score: 82 },
      { title: 'Movie D', rt_score: 73 }
    ]);
  });
});

describe('sortByRottenTomatoesLow', () => {
  const movies = [
    { title: 'Movie A', rt_score: 95 },
    { title: 'Movie B', rt_score: 82 },
    { title: 'Movie C', rt_score: 88 },
    { title: 'Movie D', rt_score: 73 }
  ];

  it('should sort movies in ascending order (low to high) by Rotten Tomatoes score', () => {
    const result = sortByRottenTomatoesLow(movies);

    expect(result).toEqual([
      { title: 'Movie D', rt_score: 73 },
      { title: 'Movie B', rt_score: 82 },
      { title: 'Movie C', rt_score: 88 },
      { title: 'Movie A', rt_score: 95 }
    ]);
  });
});

let movies = [];
let consoleErrorMock;

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
});

afterEach(() => {
  consoleErrorMock.mockRestore();
});

it('should fetch movie data and set the movies variable', async () => {
  const mockData = {
    films: [
      { title: 'Movie A' },
      { title: 'Movie B' },
      { title: 'Movie C' }
    ]
  };

  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockData)
  });

  await fetchData('./data/ghibli/ghibli.json')
    .then(data => {
      movies = data.films;
    })
    .catch(error => {
      console.error('Ocorreu um erro ao obter os dados dos filmes:', error);
      movies = [];
    });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('./data/ghibli/ghibli.json');
  expect(consoleErrorMock).not.toHaveBeenCalled();
  expect(movies).toEqual(mockData.films);
});
