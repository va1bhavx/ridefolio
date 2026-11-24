import type { CatalogueRepository } from "./interfaces/repositories"
import { motorcycles } from "./mock/catalogue-data"
import { articles } from "./mock/knowledge-data"
export const catalogue: CatalogueRepository = {
  async list() {
    return motorcycles
  },
  async find(id) {
    return motorcycles.find((m) => m.id === id)
  },
  async articles() {
    return articles
  },
  async article(slug) {
    return articles.find((a) => a.slug === slug)
  },
}
