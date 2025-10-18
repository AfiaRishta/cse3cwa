-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minutes" INTEGER NOT NULL,
    "doneAlt" BOOLEAN NOT NULL DEFAULT false,
    "doneValidation" BOOLEAN NOT NULL DEFAULT false,
    "doneLogin" BOOLEAN NOT NULL DEFAULT false,
    "doneSecureDb" BOOLEAN NOT NULL DEFAULT false,
    "doneTitleColor" BOOLEAN NOT NULL DEFAULT false
);
