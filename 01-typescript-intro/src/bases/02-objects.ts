export const pokemonIds = [1, 20, 30, 40, 66];

interface Pokemon {
	id: number;
	name: string;
	age?: number;
}

export const bulbasaur: Pokemon = {
	id: 3,
	name: "Bulbasaur",
};

export const charmander: Pokemon = {
	id: 0,
	name: "Charmander",
};

export const pokemons: Pokemon[] = [];

pokemons.push(charmander, bulbasaur);

console.log(pokemons);
