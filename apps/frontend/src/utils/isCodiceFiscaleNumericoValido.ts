export function isCodiceFiscaleNumericoValido(cf) {
  if (!/^[0-9]{11}$/.test(cf)) return false;

  let sumDispari = 0;
  let sumPari = 0;

  for (let i = 0; i < 10; i++) {
    const digit = parseInt(cf.charAt(i), 10);
    if (i % 2 === 0) {
      // posizioni dispari (0-based): somma diretta
      sumDispari += digit;
    } else {
      // posizioni pari: raddoppia e sottrai 9 se > 9
      let temp = digit * 2;
      if (temp > 9) temp -= 9;
      sumPari += temp;
    }
  }

  const total = sumDispari + sumPari;
  const resto = total % 10;
  const checkDigit = (10 - resto) % 10;

  return checkDigit === parseInt(cf.charAt(10), 10);
}
