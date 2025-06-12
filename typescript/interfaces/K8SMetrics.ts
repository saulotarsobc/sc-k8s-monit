export interface K8SMetrics {
    timestamp: Date;
    nodes: Node[];
    podMetrics: PodMetric[];
    namespaces: string[];
}

export interface Node {
    name: string;
    status: string;
    capacity: Capacity;
    allocatable: Allocatable;
}

export interface Allocatable {
    cpu: string;
    "ephemeral-storage": string;
    "hugepages-2Mi": string;
    memory: string;
    pods: string;
}

export interface Capacity {
    pods: number;
    cpu: number;
    "hugepages-2Mi": number;
    memory: number;
    "ephemeral-storage": number;
}

export interface PodMetric {
    namespace: Namespace;
    pod: string;
    cpu: string;
    memory: number;
}

export enum Namespace {
    Hcode = "hcode",
    KubeSystem = "kube-system",
}
