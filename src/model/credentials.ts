type UserCredential = {
    id: string,
    userId: string,
    publicKey: string,
    signatureCounter: number,
    credType: string,
    aaGuid: string,
    regDate: Date
    user: User
}