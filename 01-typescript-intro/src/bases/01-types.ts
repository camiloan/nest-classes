export let name: string = "Camilo";
export const age: number = 27;
export const isValid: boolean = true;

name = "Melissa";

export const templateString = `Esto es un string
multilinea
que puede tener
" dobles
' simple
inyectar valores ${name}
números: ${1 + 1}
booleanos: ${isValid}`;

console.log(templateString);
