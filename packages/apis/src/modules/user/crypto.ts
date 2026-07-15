import SHA512 from 'crypto-js/sha512'

export function encryptPassword(plain: string): string {
  return SHA512(plain).toString()
}
