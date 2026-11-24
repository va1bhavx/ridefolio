import type {
  Article,
  Collection,
  Motorcycle,
  OwnershipData,
  User,
} from "@/types/models"
export interface CatalogueRepository {
  list(): Promise<Motorcycle[]>
  find(id: string): Promise<Motorcycle | undefined>
  articles(): Promise<Article[]>
  article(slug: string): Promise<Article | undefined>
}
export interface OwnershipRepository {
  read(userId: string): Promise<OwnershipData>
  save<K extends Collection>(
    userId: string,
    collection: K,
    item: OwnershipData[K][number]
  ): Promise<void>
  remove(userId: string, collection: Collection, id: string): Promise<void>
  preferences(
    userId: string,
    value: OwnershipData["preferences"]
  ): Promise<void>
}
export interface AuthenticationService {
  session(): Promise<User | null>
  login(email: string, password: string): Promise<User>
  register(name: string, email: string, password: string): Promise<User>
  signOut(): Promise<void>
}
